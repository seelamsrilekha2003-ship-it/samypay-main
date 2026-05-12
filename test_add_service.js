const service = require('./user-roles/user-roles.service');

async function testAdd() {
    try {
        const res = await service.createRole({
            role_name: 'Test Slab',
            role_code: 'TEST_SLAB',
            description: 'Test',
            can_add_users: 0,
            is_active: 1
        });
        console.log("SUCCESS:", res);
    } catch (err) {
        console.log("ERROR:", err.message);
        console.error(err.stack);
    }
}

testAdd();
