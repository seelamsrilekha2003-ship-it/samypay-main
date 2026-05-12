const axios = require('axios');

async function testAdd() {
    try {
        const res = await axios.post('http://localhost:5000/api/user-roles', {
            role_name: 'Test Slab',
            role_code: 'TEST_SLAB',
            description: 'Test',
            can_add_users: 0,
            is_active: 1
        });
        console.log(res.data);
    } catch (err) {
        console.log("FULL ERROR:");
        if (err.response) {
            console.log(err.response.status);
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }
}

testAdd();
