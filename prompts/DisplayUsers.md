Objective #1

    1). Here in the user management, I want the tracking works here. For now dont do anything in creating, focus only on displaying and deleting the users.

    2). Now comes the policy, only who has the role "admin" can delete all this data. Since Im logged in as admin, I can do all no exceptions.

    3). Give the summary first before execution and wait for the Go command.

Objective #1: Policy for tbl_users

    1). In the admin side for user management, the policy of the admin is admin can do anything no exception, CRUD but only for who has a tbl_users.role = "admin"

    2). In the auth registration policy, anyone can register no exception. Now comes the policy, only who has the role "admin" can delete all this data. Since Im logged in as admin, I can do all no exceptions.

    3). The user who has a tbl_users.role = "guest", can do CRUD but only on their id or who is the active user guest. They cannot modified any data, only on their own.

    4). Give the summary first before execution and wait for the Go command.

Objective #2:

    1). Since I'm the admin, I cannot really add a user manually.

    2). Remove all the functionality for the creation of the users. Delete all the files that is not nedeed anymore

    3). Do not remove the POLICY of the admin for CREATE, it still stays for my future implementation.