const userRolesService = require('./user-roles/user-roles.service');

async function testSlabOperations() {
    console.log("Starting Slab Operations Test...");

    try {
        // 1. Create a Role
        const newRoleData = {
            role_name: "Test Role " + Date.now(),
            role_code: "TEST_ROLE_" + Date.now(),
            description: "Test Description",
            commission_multiplier: 1.5,
            can_add_users: 1,
            is_active: 1
        };

        console.log("Creating role...", newRoleData);
        const createdRole = await userRolesService.createRole(newRoleData);
        console.log("Role created successfully:", createdRole);

        if (!createdRole.id) {
            throw new Error("Created role has no ID");
        }

        // 2. Update the Role
        const updateData = {
            role_name: createdRole.role_name + " Updated",
            description: "Updated Description",
            commission_multiplier: 2.0,
            can_add_users: 0,
            is_active: 0
        };

        console.log("Updating role...", updateData);
        await userRolesService.updateRole(createdRole.id, updateData);
        console.log("Role updated successfully.");

        // Verify Update
        const updatedRole = await userRolesService.getRoleById(createdRole.id);
        console.log("Verified Updated Role:", updatedRole);

        if (updatedRole.role_name !== updateData.role_name) {
            throw new Error("Update failed: Role name mismatch");
        }
        if (updatedRole.can_add_users !== updateData.can_add_users) {
            throw new Error("Update failed: can_add_users mismatch");
        }

        // 3. Delete the Role
        console.log("Deleting role...");
        await userRolesService.deleteRole(createdRole.id);
        console.log("Role deleted successfully.");

        // Verify Deletion
        const deletedRole = await userRolesService.getRoleById(createdRole.id);
        if (deletedRole) {
            throw new Error("Deletion failed: Role still exists");
        }

        console.log("All Slab Operations Tests Passed!");

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testSlabOperations();
