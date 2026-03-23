Objective #1: Authentication

    1). Here in the registration form, this is where the user will register.

    2). In the registration add a contact number field.
    
    3). Create a new table name "tbl_users" using terminal migration.

    4). Use both Schema:public and Schema:auth.users. So in the tbl_users table will have specific columns since the other data will store on the Schema:auth.users such as the password and etc.

    5). The tbl_users must have these columns:

        - id
        - given_name
        - surname
        - role (this is other columns for role) because there's a role column in the auth.users but for authenticated only 
        - status

    6). If someone registered here in the registration page, their default role is "guest"

    7). Give summary first before execution of the code. Wait for the Go command.

Objective #2: Redirection

    1). When the user signs-in and it checks the role "admin" it will be redirected to the "/admin/dashboard" and as well for "/guest/dashboard".

    2). Give summary first before execution of the code. Wait for the Go command.

Objective #3: Fix the Redirection

    1). I noticed that even though my role is "admin" in the tbl_users, I got redirected to the guest routes which is wrong, it should be on the admin routes.

    2). When I logged out in the admin side, then go back, i can't get through it and that's right, but in the "guest" role when i logged out and go back, i can still access which is wrong.

    3). Give summary first before execution of the code. Wait for the Go command.