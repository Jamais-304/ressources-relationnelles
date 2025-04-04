import { type UserReqBodyRequest } from "../interfaces/userInterfaces.ts"
export function deleteUserObjectId(userObject: UserReqBodyRequest) {
    delete userObject.id
    delete userObject.userId
    delete userObject._id
    delete userObject.uuid
    return userObject
}
