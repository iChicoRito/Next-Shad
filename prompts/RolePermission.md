Objective #1

    1). In the adding of the permission, as u can see the user needs to choose what roles they need to put the permission. Now it works fine and no problem with that.

    2). Now create a new table name "tbl_role_permissions" using terminal migrations. The tbl_role_permissions must have these columns:

        tbl_role_permissions
        - id
        - roles_id           FK -> tbl_roles.id
        - permission_id     FK -> permission_id.id

    3). So this way, this looks organized and it has many to many relatioship and the process are still the same.