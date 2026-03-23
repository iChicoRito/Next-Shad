Objective #1

    1). These codes has only static data and for prototypes purpose. Based on the instructions give, use only tabler icons so replace all the lucid icons to tabler icons.

    2). In the create-users-dialog, these are the fields of the users creations:

        - Surname
        - Given Name
        - Email Address
        - Password
        - Confirm Password
        - Status
        - Role

        Make sure that every fields has an validation.

    3). In the view-users-data table, it shows all the data base on the fields. The data is only based on the data.json for static data only, no backend.

    4). In the table also, make the table header has a sorter so i can click the sorter and it will be sorted.

    5). Modify the stats card that shows only the data from the table and json that has a static data.

    6). Give summary first before execution of the code. Wait for the Go command.

Objective #2

    1). Now in the table, the action view Details when clicked, it shows the dialog modal of the view-users dialog like in the roles but remember, only static data.

    2). create a new file delete-users-dialog modal and the UI must like the deletion dialog of the roles

Objective #3: Real data with backend.

    1). Create a new table name "tbl_users" using terminal migration.

    2). use both Schema:public and Schema:auth.users. So in the tbl_users table will have specific columns since the other data will store on the Schema:auth.users such as the password and etc.

    3). The tbl_users must have these columns:

        - id
        - given_name
        - surname
        - role (this is other columns for role) because there's a role column in the auth.users but for authenticated only 
        - status
    
    4). Also add a field in the creation for phone number field. Since the schema:auth.users has already a column for phone

    5). Give summary first before execution of the code. Wait for the Go command.