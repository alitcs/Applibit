# Applibit
AI tool to help applicants apply more efficiently and with a higher degree of quality

Stack

Next.js
Pythonok im 

I want to create a website that helps people apply to jobs more efficiently.
A user opens the website
User must enter an email and verify it
User enters username then password
Then UI for real site opens
User enters some information about their professional experience
Whenever the user finds a new job posting, they paste the job description into the box and click “generate resume”
The user receives a resume with their professional experience filtered to only show the experience most geared towards that job posting
High level overview: 
You open the website and are met with an email field, once the user enters the email and is verified a new box to enter a username is there instead, once the username is entered, below that a password box is opened for the user to enter their password.
Once thats complete the user has created an account and will see a new page with some sections for them to enter your resume details.
At the very top is a large mandatory section for you to enter your:
Fullname (required)
phone number (required)
email (required)
linkedin (optional)
github (optional)
Then below that section you will see a “+” icon and when you click it, you will see a mini menu show up that lets you add a new section amongst these options: 
Summary of Qualifications (can add only 1) (optional)
Education (can add up to 3) (optional)
Projects (can add up to 40) (optional)
Experience (can add up to 20) (optional)
Technical Skills (can add only 1) (optional)
Volunteer (can add up to 30) (optional)
Now before going through those optional options here are a few rules about how these options will work from the users point of view.
The “+” icon
(Anytime the user is able to add up to a certain number of any item, there will be a “+” icon to add a new item until that limit is reached, at which point the “+” icon will be grayed out. For example, when adding multiple Project items, anytime you wish to add another project, you must click the “+” icon, you can keep doing so until the limit for the number of projects is reached. Similarly if you want to add multiple bullet points to describe a single project, you must click the “+” icon to keep adding new bullet points until the limit for the number of bullet points is reached. These rules apply across all sections.
Char limits
Each bullet point will have a char limit of 300
The names for institutions (schools, workplaces, volunteer organizations) aswell as projects will have a char limit of 100
Dates will have a char limit of 50
Locations will have a char limit of 50
Name field will have a char limit of 100
GitHub and LinkedIn fields will have a char limit of 100
Email and Phone fields should be optimized to receive an email and phone number respectively
Tools used sections will have a char limit of 300
Languages, technologies and courses sections will all have a char limit of 300
Date Fields for will be in the format (Month Year) eg. January 2024 or (Month Year - Month Year) depending on users preference
User defined “must include”
A user may choose to select certain items on the resume to be checked off as “must include” this will allow the backend to see which items the user wants to include on the final resume no matter what, whereas the ones not checked off by the user as “must include”, may either be included in the final resume or not depending on the job posting given for that run. For example a user might really like one of their projects and check it off as “must include”. That allows the backend to know when selecting which projects best align the job posting given, to include the project checked off as “must include” before adding the rest of the projects the backend deems to be best for the given job listing. A similar thing can be said for a user really wanting to showcase their education, or a place they worked at under the “Experience” section, etc.

Now for each of the optional sections on the resume:

Summary of Qualifications
Lets the user enter:
up to 7 bullet points with a minimum of 1
Education
Lets the user enter:
Name of Institution (required)
Name of degree (optional)
Awards (optional)
Date (required)
Location (required)
Projects 
Lets the user enter: 
Project name (required)
Tools used (required)
Date (required)
up to 7 bullet points with a minimum of 1

Experience
Lets the user enter:
Workplace name (required)
job title (required)
Date (required) 
up to 7 bullet points with a minimum of 1

Technical Skills
Lets the user enter:
Languages (optional)
Technologies (optional)
Courses (optional)

Volunteer
Lets the user enter: 
Name of Organization (required)
title (required)
Date (required)
up to 7 bullet points with a minimum of 1

How the UI will interact with the backend:
Anytime a user edits their resume/professional experience details, it will update on the backend, we will store the user as an object with fields username, email, password and resume.
The resume itself will also be an object with various fields of info that will be updated whenever the user updates it on the UI on their end.
A user can paste in a job posting they've found and click “generate resume”. Once thats done the Resume object from the user is passed in JSON to the python script in the backend that will create a perfect resume for that job posting and return it in some file format.
While this process is running the user will see some loading icon until the files ready for download at which point the user will be met with a download icon for them to download their resume.
The part of the site that the user pasted in the original job posting will return to its original state ready to accept another job posting. 
