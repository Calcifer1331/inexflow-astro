import { db } from './index';
import type { User, NewUser, UserSession } from './schema';
import { user } from './schema';
import { eq, ilike } from 'drizzle-orm/mysql-core/expressions';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { UUID } from 'node:crypto';

// export async function findUserByEmail(email: string): Promise<AuthenticateUser | null> {
//     return (await db.select({
//         id: appUser.id,
//         username: appUser.username,
//         userRole: appUser.userRole,
//         isEnable: appUser.isEnable,
//         isLocked: appUser.isLocked,
//     }).from(appUser).where(sql`LOWER(${appUser.email}) = LOWER(${email})`))[0]
// }

// export async function existsUserByEmailAndUsername(
//     email: string,
//     username: string,
// ): Promise<[boolean, boolean]> {
//     const [emailExists, usernameExists] = await Promise.all([
//         db
//             .select({ id: appUser.id })
//             .from(appUser)
//             .where(sql`LOWER(${appUser.email}) = LOWER(${email})`)
//             .limit(1),
//         db
//             .select({ id: appUser.id })
//             .from(appUser)
//             .where(sql`LOWER(${appUser.username}) = LOWER(${username})`)
//             .limit(1)
//     ]);

//     return [emailExists.length > 0, usernameExists.length > 0];
// }

export async function authenticateUser(email: string, password: string) {
    const [ressult] = await db.select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: user.passwordHash,
        businessId: user.businessId,
        isActive: user.isActive,
    }).from(user)
        .where(sql`LOWER(${user.email}) = LOWER(${email})`)
        .limit(1);

    if (!ressult) return null;

    const { passwordHash, ...userSession } = ressult;

    const isPasswordValid = await bcrypt.compare(
        password, passwordHash
    );

    return isPasswordValid ? userSession : null;
}

// export async function findUserSession(userId: UUID) {
//     return await db.select({
//         id: appUser.id,
//         avatar: appUser.avatar,
//         isEnable: appUser.isEnable,
//         isLocked: appUser.isLocked,
//         userRole: appUser.userRole,
//         username: appUser.username,
//     })
//         .from(appUser)
//         .where(eq(appUser.id, userId))
//         .limit(1)
//         .then(rest => rest[0] ? rest[0] : null);
// }

// export async function persistUser(user: NewAppUser) {
//     user.passwordHash = await bcrypt.hash(user.passwordHash, await bcrypt.genSalt(10))
//     await db.insert(appUser).values(user).execute()
// }

// export async function enableUserById(id: UUID) {
//     await db.update(appUser)
//         .set({ isEnable: true })
//         .where(eq(appUser.id, id));
// }

// export async function passwordResetUser(userId: UUID): Promise<Omit<AuthenticateUser, "username"> | null> {
//     return (await db.select({
//         id: appUser.id,
//         userRole: appUser.userRole,
//         isEnable: appUser.isEnable,
//         isLocked: appUser.isLocked
//     }).from(appUser).where(eq(appUser.id, userId)).limit(1))[0];
// }

// export async function changePassword(userId: UUID, userPassword: string) {
//     userPassword = await bcrypt.hash(userPassword, await bcrypt.genSalt(10))
//     await db.update(appUser).set({ passwordHash: userPassword }).where(eq(appUser.id, userId))
// }

// export async function margeAvatarInUser(avatar: UUID, userId: UUID) {
//     await db.update(appUser).set({ avatar }).where(eq(appUser.id, userId));
// }

// export async function margePersonalInfo(userId: UUID, userInfo: PersonalInfo) {
//     await db.update(appUser).set({ ...userInfo }).where(eq(appUser.id, userId));
// }

// export async function findUserProfileInfo(userId: UUID) {
//     return (await db.select({
//         lastName: appUser.lastName,
//         firstName: appUser.firstName,
//         gender: appUser.gender,
//         phoneNumber: appUser.phoneNumber,
//         email: appUser.email, username: appUser.username
//     }).from(appUser).where(eq(appUser.id, userId)).limit(1))[0];
// }

// export async function findAll() {
//     return await db.select().from(appUser);
// }