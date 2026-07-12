import { authService, messageService } from '../../services/api';

export function initializeAirspace() {
    const airspaceDisplay = document.querySelector('.airspace-display');
    const currentUser = authService.getUser();
    
    if (!currentUser) return;
    
    airspaceDisplay.innerHTML = `
        <div class="airspace glass-card p-6 rounded-xl border border-zinc-800 bg-zinc-900 bg-opacity-70">
            <h2 class="text-lg font-medium text-zinc-100 mb-4 font-sans">Live Airspace Radar Monitor</h2>
            <div class="map-container flex flex-col items-center">
                <div class="relative w-80 h-80 rounded-full border border-zinc-800 overflow-hidden flex items-center justify-center" style="background: #05070a; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
                    <!-- Radial grid lines -->
                    <div class="absolute w-60 h-60 rounded-full border border-dashed border-zinc-900"></div>
                    <div class="absolute w-40 h-40 rounded-full border border-dashed border-zinc-900"></div>
                    <div class="absolute w-20 h-20 rounded-full border border-dashed border-zinc-900"></div>
                    
                    <!-- Axis crosses -->
                    <div class="absolute w-full h-px bg-zinc-900"></div>
                    <div class="absolute w-px h-full bg-zinc-900"></div>
                    
                    <!-- Sector Boundary line -->
                    <div class="absolute w-full h-px bg-zinc-800" style="transform: rotate(30deg); border-top: 1px dashed rgba(217, 119, 6, 0.4);">
                        <span class="absolute right-4 text-[9px] text-amber-600 font-mono" style="transform: translateY(-12px);">SECTOR BOUNDARY</span>
                    </div>
                    
                    <!-- Radar sweeping line -->
                    <div class="radar-sweep absolute w-1/2 h-px bg-gradient-to-r from-transparent to-zinc-600" style="transform-origin: left center; left: 50%; top: 50%;"></div>
                    
                    <!-- Aircraft Blip -->
                    <div id="aircraft-blip" class="absolute w-3 h-3 bg-zinc-100 rounded-full flex items-center justify-center transition-all duration-1000 ease-linear" style="left: 30%; top: 65%;">
                        <div class="absolute w-6 h-6 rounded-full border border-zinc-100 animate-ping opacity-25"></div>
                        <span id="radar-callsign" class="absolute left-4 top-0 text-[10px] font-mono font-medium text-zinc-100 whitespace-nowrap bg-zinc-950 px-1 py-0.5 rounded border border-zinc-850">BAW123 [CDA: EGTT]</span>
                    </div>
                </div>
                
                <!-- Status Telemetry -->
                <div class="telemetry-info mt-6 w-full font-mono text-[11px] text-zinc-500 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                    <div class="flex justify-between mb-1" style="display: flex; justify-content: space-between;">
                        <span>AIRCRAFT:</span>
                        <span id="telemetry-callsign" style="color: #d4d4d8;">BAW123</span>
                    </div>
                    <div class="flex justify-between mb-1" style="display: flex; justify-content: space-between;">
                        <span>MODE S CODE:</span>
                        <span id="telemetry-modes" style="color: #d4d4d8;">C0A1F2</span>
                    </div>
                    <div class="flex justify-between mb-1" style="display: flex; justify-content: space-between;">
                        <span>COORDINATES:</span>
                        <span id="telemetry-coords" style="color: #d4d4d8;">N 51° 28.6', W 000° 27.8'</span>
                    </div>
                    <div class="flex justify-between mb-1" style="display: flex; justify-content: space-between;">
                        <span>DATA AUTHORITY:</span>
                        <span id="telemetry-authority" class="text-amber-500 font-semibold" style="color: #d97706; font-weight: 600;">EGTT (LONDON CENTER)</span>
                    </div>
                    <div id="handover-banner" class="mt-2 text-center text-zinc-400 font-sans italic hidden" style="color: #a1a1aa; text-align: center; margin-top: 8px; font-style: italic;">
                        ⚠️ Sector Boundary Crossed. Initiating contact switch...
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupRadarSimulation(currentUser);
}

function setupRadarSimulation(user) {
    const blip = document.getElementById('aircraft-blip');
    const callsignText = document.getElementById('radar-callsign');
    const telCallsign = document.getElementById('telemetry-callsign');
    const telModeS = document.getElementById('telemetry-modes');
    const telCoords = document.getElementById('telemetry-coords');
    const telAuthority = document.getElementById('telemetry-authority');
    const handoverBanner = document.getElementById('handover-banner');

    if (!blip) return;
    
    const isPilot = user.role === 'pilot';
    const pilotCallsign = isPilot ? user.username.toUpperCase() : 'BAW123';
    const pilotModeS = isPilot ? (user.mode_s_address || 'C0A1F2') : 'C0A1F2';
    
    telCallsign.innerText = pilotCallsign;
    telModeS.innerText = pilotModeS;
    
    let x = 30;
    let y = 65;
    let step = 0;
    
    if (!document.getElementById('radar-keyframes')) {
        const style = document.createElement('style');
        style.id = 'radar-keyframes';
        style.innerHTML = `
            @keyframes sweep {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .radar-sweep {
                animation: sweep 4s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    const intervalId = setInterval(() => {
        const blipRef = document.getElementById('aircraft-blip');
        if (!blipRef) {
            clearInterval(intervalId);
            return;
        }
        
        step += 1;
        x = 30 + (step * 2);
        y = 65 - (step * 1.5);
        
        blipRef.style.left = `${x}%`;
        blipRef.style.top = `${y}%`;
        
        const lat = (51.4775 - (step * 0.005)).toFixed(4);
        const lon = (0.4614 + (step * 0.007)).toFixed(4);
        if (telCoords) {
            telCoords.innerText = `N ${lat}°, W ${lon}°`;
        }
        
        const crossedBoundary = step >= 15;
        if (crossedBoundary && step < 25) {
            if (handoverBanner) {
                handoverBanner.classList.remove('hidden');
                handoverBanner.style.display = 'block';
            }
            if (callsignText) {
                callsignText.innerText = `${pilotCallsign} [HANDOVER]`;
                callsignText.style.borderColor = '#d97706';
            }
            
            messageService.getHistory().then(messages => {
                const contactCleared = messages.some(m => m.msg_code === 'UM117');
                if (contactCleared) {
                    if (telAuthority) {
                        telAuthority.innerText = 'KZWY (NEW YORK CENTER)';
                        telAuthority.style.color = '#22c55e';
                    }
                    if (callsignText) {
                        callsignText.innerText = `${pilotCallsign} [CDA: KZWY]`;
                        callsignText.style.borderColor = '#22c55e';
                    }
                    if (handoverBanner) {
                        handoverBanner.innerText = '✅ Contact Switch Complete. Connected to New CDA.';
                    }
                } else {
                    if (telAuthority) {
                        telAuthority.innerText = 'EGTT (LOSING COORD AUTHORITY)';
                        telAuthority.style.color = '#d97706';
                    }
                }
            }).catch(e => console.error(e));
        } else if (step >= 25) {
            if (handoverBanner) {
                handoverBanner.style.display = 'none';
            }
        } else {
            if (handoverBanner) {
                handoverBanner.style.display = 'none';
            }
            if (callsignText) {
                callsignText.innerText = `${pilotCallsign} [CDA: EGTT]`;
                callsignText.style.borderColor = '#1e293b';
            }
            if (telAuthority) {
                telAuthority.innerText = 'EGTT (LONDON CENTER)';
                telAuthority.style.color = '#d97706';
            }
        }
        
        if (step > 30) {
            step = 0;
        }
    }, 2000);
    
    if (window.radarIntervalId) {
        clearInterval(window.radarIntervalId);
    }
    window.radarIntervalId = intervalId;
}