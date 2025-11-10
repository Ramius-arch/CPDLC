from flask import Blueprint, jsonify

bp = Blueprint('airspace', __name__, url_prefix='/api')

@bp.route('/airspace-data', methods=['GET'])
def get_airspace_data():
    # Dummy data for now
    airspace_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Restricted Area 1",
                    "type": "restricted"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-0.1, 51.5],
                            [-0.1, 51.6],
                            [0.1, 51.6],
                            [0.1, 51.5],
                            [-0.1, 51.5]
                        ]
                    ]
                }
            }
        ]
    }
    return jsonify(airspace_data)