# AR Fault Detection System
Marker based fault detection prototype built for railway maintenance sites.Includes role-based access-control for maintenance personnel.
This is only a basic prototpe with backend/Database integration. 

## Features
- AR functionality for marker detection with browser integration.
- Includes a set of markers corresponding to a range of different faults (e.g Stress zone, track fault, lighting fault etc).
- Incorporates a basic log system that acts as an in-memory storage, giving you the options of saving or dismissing faults
  (Especially useful for keep track of faults being taken care of within the same session or where persistance isn't needed).
- Database storage for faults, fault assignments and user info.

## Client-side Testing
```bash
cd client
npm start
```
### Login
The prototypes login/user-authentication system can be tested for the landing page desgined for the technician.
To access this page, log in using the technicians mock credentials shown below.

User: Technician
Pass: secure456

## Server-side 
```bash
cd server
npm run dev
```

## Notes
This is a university and learning project so there is not much feature consolidation/updates past the functioning
protoype.
