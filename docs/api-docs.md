# API Documentation

## Introduction

This documentation provides a detailed description of the application's API endpoints, their functionalities, and how to interact with them. The API is designed to be RESTful and follows standard practices for resource representation.

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Authentication

- **Bearer Token**: All authenticated endpoints require a valid Bearer token in the `Authorization` header.
  
  Example:
  ```bash
  Authorization: Bearer <token>
