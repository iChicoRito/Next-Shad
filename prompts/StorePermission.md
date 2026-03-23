Objective #1

    1). Create a table for "tbl_permission" using only command migration.

    2). The table must have these columns:

        - id
        - role_id           Fk -> tbl_roles.id
        - permission_name
        - description
        - status

    3). As u can see, in the role pages, this is where they roles. Now in the adding of the
        permission, they need to choose what roles they will add those permissions

    4). The adding of the permissions in 1 role can be single/multiple adding using the form repeater.

Objective #2

    1). In the roles page, make the edit roles works.

    2). Create an edit \roles\components\edit-role-dialog.tsx where I can edit the roles, description, status and also I can
        add or remove the permission.

    3). In the adding and removing of the permission, it should be a checkboxes.