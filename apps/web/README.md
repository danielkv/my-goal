# Goal web
Delivers an interface to manage worksheets and users. 

# Technologies
To develop this application SolidJS was chosen for 2 main reason, first to test and learn its rendering and reacting speed, I had a concern with performance given that we could have many loops because of the worksheet model. Second was to learn something new, Today this project is running in production, but it was not the idea initially. So I took a shot with SolidJS instead of React, which was going to be my second option.

## List of technologies
- SolidJS
- Firebase (DB and Authentication)
- Vercel (hosting)
- Open source libs (not only):
	- suid (MUI for SolidJS)
	- radash
	- dayjs
## Process

The most interesting part of developing this application was to parse the text to worksheet model. It waas very challenging given the variations of types of workouts, timers, exercises, reps and weight. To parse the text was used a combination of Regex patterns and keywords. This was necessary to make easier for the admins to add new workout plans.
