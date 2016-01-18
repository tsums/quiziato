Quiziato™
========

Quiziato™ is a real time classroom quiz system for instructors to gauge student performance and understanding. It was inspired by the [i>clicker system](https://www1.iclicker.com/) used at many universities (although their mobile offering was not available at the time this was started). There is an accompanying iOS application (to be published).

The app uses web sockets to provide realtime communication to connected mobile devices in the classroom, while the instructor manages the course session through the web dashboard.

## Features
- Accounts & Authentication
- Instructor can create Multiple Choice Questions
- Student Attendance during class sessions.
- Timed assignment of multiple choice questions.
- Students and Instructor can review student performance.
- Graded & Ungraded questions.

## Next Steps
- Open Ended Questions
- 'Raise Hand' feature.
- Android Application.
- Administrative Dashboard and Features.
- Login Integration with existing LDAP, etc.

## Built with
- NodeJs, Express, & Socket.io
- MongoDB & Mongoose
- Redis
- Jade, AngularJS & Bootstrap

## Developing
1. `cp env.json.dist env.json` and edit the environment variables to suit your needs.
2. `npm install`
3. `gulp`
