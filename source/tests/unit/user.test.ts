import { User } from "../../models/user";

describe('testing user ID methods', () => {
    test('user id should match what we pass in the constructor', () => {
        let user = new User(2);
        expect(user.id).toBe(2);
    })

    test('user id should match what we pass in the setter', () => {
        let user = new User(2);
        user.id = 3;
        expect(user.id).toBe(3);
    })
})

