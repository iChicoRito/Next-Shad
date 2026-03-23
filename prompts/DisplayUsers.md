Objective #1

    1). Here in the user management, I want the tracking works here. For now dont do anything in creating, focus only on displaying and deleting the users.

    2). Now comes the policy, only who has the role "admin" can delete all this data. Since Im logged in as admin, I can do all no exceptions.

    3). Give the summary first before execution and wait for the Go command.

Objective #2: Policy for tbl_users

    1). In the admin side for user management, the policy of the admin is admin can do anything no exception, CRUD but only for who has a role = "admin"

    2). In the auth registration policy, anyone can register no exception.

    3). The user who has a role = "guest", can do CRUD but only on their id or who is the active user guest. They cannot modified any data, only on their own.

Objective #3: Admin CRUD

    1). In the admin user management, when I tried to view, the user some of the information not showing

    2). When the admin tried to delete it shows
        {
            "code": "no_authorization",
            "message": "This endpoint requires a valid Bearer token"
        }

    3). Make the user who has role "admin" can do anything.