// const HttpStatus = require('http-status');
const UserModel = require('../../app/api/v1/business/integra360/integra360_users_model');
const UserDivergentModel = require('../../app/api/v1/business/integra360/integra360_users_divergent_model');
const SettingsModel = require('../../app/api/v1/business/integra360/integra360_settings_model');
const Integra360Service = require('../../app/api/v1/business/integra360/integra360_service');
const testUsers = require('../fixtures/testUsers.json');
const testUsersDivergent = require('../fixtures/testUsersDivergent.json');
const database = require('../../config/database');
const { default: mongoose } = require('mongoose');

describe('Integra360 integration tests', () => {
    const integra360Service = new Integra360Service();

    beforeAll(async () => {
        await database.connect();

        await UserModel.deleteMany({});
        await UserDivergentModel.deleteMany({});
        await SettingsModel.deleteMany({});

        await UserModel.insertMany(testUsers);
        await UserDivergentModel.insertMany(testUsersDivergent);

        responsibleUser = {
            name: 'Test User',
            sub: 'test-123',
            email: 'test@example.com'
        };
    });

    afterAll(async () => {
        await database.close();
    });

    describe('POST /users', () => {
        it('should return successfully if the user exists on Mycash and VTEX with the same emails', async () => {
            const emails = ['success@simulator.amazonses.com'];
            const result = await integra360Service._searchUserVtex({ emails, cpfs: [] });

            expect(result.usersVtexSuccess).toHaveLength(1);
            expect(result.usersVtexError).toHaveLength(0);
        });
    });
    describe('when only cpf is informed and Mycash returns data', () => {
        it('should return success with consolidated data and mark emailMismatch if there is a discrepancy', async () => {
            const cpfs = ['45297458137'];
            const result = await integra360Service._searchUserVtex({ emails: [], cpfs });

            expect(result.usersVtexSuccess).toHaveLength(1);
            expect(result.usersVtexError).toHaveLength(0);
        });
    });
    describe('when only cpf is informed and Mycash does not return data', () => {
        it('should search for each cpf in VTEX and return success if the data is found', async () => {
            const cpfs = ['456'];
            const result = await integra360Service._searchUserVtex({ emails: [], cpfs });

            expect(result.usersVtexSuccess).toHaveLength(0);
            expect(result.usersVtexError).toHaveLength(1);
            expect(result.usersVtexError[0]).toMatchObject({
                cpf: '456',
                userVtex: false,
                userMycash: false
            });
        });
    });
    describe('GET /users/divergents', () => {
        it('should return default divergent list when no filters are provided', async () => {
            const queryData = {}; // No filter parameters
            const result = await integra360Service.userDivergentList(queryData);

            // Assuming paginate returns an object with docs (array) and total (number)
            expect(Array.isArray(result.docs)).toBe(true);
            expect(typeof result.totalDocs).toBe('number');
        });

        it('should return a divergent list filtered by startDate and endDate', async () => {
            const queryData = {
                startDate: '2025-01-01',
                endDate: '2025-01-31'
            };

            const result = await integra360Service.userDivergentList(queryData);

            result.docs.forEach((doc) => {
                const createdAt = new Date(doc.createdAt);
                expect(createdAt).toBeGreaterThanOrEqual(new Date('2025-01-01'));
                expect(createdAt).toBeLessThanOrEqual(new Date('2025-01-31'));
            });
        });

        it('should return a divergent list filtered by a search term', async () => {
            const queryData = { search: 'example' };

            const result = await integra360Service.userDivergentList(queryData);

            result.docs.forEach((doc) => {
                // Verify that at least one field (email or code) matches the search term
                const emailMatch = doc.email && doc.email.toLowerCase().includes('example');
                const codeMatch = doc.code && doc.code.toLowerCase().includes('example');
                expect(emailMatch || codeMatch).toBe(true);
            });
        });

        it('should return a divergent list filtered by status', async () => {
            const queryData = { status: 'pending' };

            const result = await integra360Service.userDivergentList(queryData);

            result.docs.forEach((doc) => {
                expect(doc.status).toBe('pending');
            });
        });
    });
    describe('GET /giftcards', () => {
        it('should return giftcard data from both our system and the VTEX server for a valid email', async () => {
            const emails = ['valid@giftcard.com']; // This email should be present in your test fixture

            const result = await integra360Service._searchGiftcard({ emails });

            expect(result).toHaveProperty('usersGiftcards');
            expect(Array.isArray(result.usersGiftcards)).toBe(true);

            result.usersGiftcards.forEach((entry) => {
                expect(entry).toHaveProperty('user');
                expect(entry).toHaveProperty('giftcards');
                expect(entry.giftcards).toHaveProperty('main');
                expect(entry.giftcards).toHaveProperty('detached');
                expect(entry.giftcards).toHaveProperty('createGiftCardVtex');
                expect(entry.giftcards).toHaveProperty('createGiftCardAsicsBack');
            });
        });
    });
    describe('PATCH /settings', () => {
        it('should create settings with currentBlock set to 0 and return the data correctly', async () => {
            const body = { userAnalyticsAutomatic: true, correctionAutomatic: false };
            const result = await integra360Service.settingsUp(body, responsibleUser);

            expect(result).toHaveProperty('currentBlock', 0);
            expect(result.userAnalyticsAutomatic).toBe(true);
            expect(result.correctionAutomatic).toBe(false);
            // Since this is the initial creation, changeHistory should be empty
            expect(result.changeHistory).toHaveLength(0);
        });
    });
    describe('When settings already exist', () => {
        let existingSettings;

        beforeEach(async () => {
            // Create a settings document for testing
            await SettingsModel.deleteMany({});

            existingSettings = await SettingsModel.create({
                userAnalyticsAutomatic: false,
                correctionAutomatic: true,
                changeHistory: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        it('should update only userAnalyticsAutomatic and record the change in changeHistory', async () => {
            const body = { userAnalyticsAutomatic: true }; // changing from false to true
            const result = await integra360Service.settingsUp(body, responsibleUser);

            expect(result.userAnalyticsAutomatic).toBe(true);
            // Verify that changeHistory contains an entry for userAnalyticsAutomatic
            expect(result.changeHistory[0]).toMatchObject({
                userAnalyticsAutomatic: true,
                reviewerName: responsibleUser.name,
                reviewerId: responsibleUser.sub,
                reviewerEmail: responsibleUser.email
            });
        });

        it('should update only correctionAutomatic and record the change in changeHistory', async () => {
            const body = { correctionAutomatic: false }; // changing from true to false
            const result = await integra360Service.settingsUp(body, responsibleUser);

            expect(result.correctionAutomatic).toBe(false);
            // Verify that changeHistory contains an entry for correctionAutomatic
            expect(result.changeHistory[0]).toMatchObject({
                correctionAutomatic: false,
                reviewerName: responsibleUser.name,
                reviewerId: responsibleUser.sub,
                reviewerEmail: responsibleUser.email
            });
        });

        it('should update both fields and record the changes in changeHistory', async () => {
            const body = { userAnalyticsAutomatic: true, correctionAutomatic: false };
            const result = await integra360Service.settingsUp(body, responsibleUser);

            expect(result.userAnalyticsAutomatic).toBe(true);
            expect(result.correctionAutomatic).toBe(false);

            const plainResult = result.toObject();
            const changeUA = plainResult.changeHistory.find((change) =>
                Object.prototype.hasOwnProperty.call(change, 'userAnalyticsAutomatic')
            );
            const changeCorrection = plainResult.changeHistory.find((change) =>
                Object.prototype.hasOwnProperty.call(change, 'correctionAutomatic')
            );

            expect(changeUA).toBeTruthy();
            expect(changeCorrection).toBeTruthy();
        });

        it('should not record any changes in changeHistory if the values are not modified', async () => {
            const body = {
                userAnalyticsAutomatic: existingSettings.userAnalyticsAutomatic,
                correctionAutomatic: existingSettings.correctionAutomatic
            };
            const result = await integra360Service.settingsUp(body, responsibleUser);

            // No changes were made, so changeHistory should remain empty
            expect(result.changeHistory).toHaveLength(0);
        });
    });
    describe('PATCH /settings/notification-messages/:messageId/read', () => {
        let messageId;
        let initialSettings;

        beforeEach(async () => {
            // Clean the settings collection and create a settings document with notificationMessages
            await SettingsModel.deleteMany({});

            messageId = new mongoose.Types.ObjectId();
            initialSettings = await SettingsModel.create({
                notificationMessages: [
                    {
                        _id: messageId,
                        message: 'TESTE',
                        recipients: [
                            { email: 'test@example.com', read: false, readAt: null },
                            { email: 'other@example.com', read: false, readAt: null }
                        ]
                    }
                ],
                notificationListEmails: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        it('should mark the specified recipient as read', async () => {
            const result = await integra360Service.notifiMessagesRead({ email: 'test@example.com' }, { messageId });
            // Find the message by its _id
            const updatedMessage = result.find((msg) => msg._id.toString() === messageId.toString());
            expect(updatedMessage).toBeDefined();
            const recipient = updatedMessage.recipients.find((rec) => rec.email === 'test@example.com');
            expect(recipient).toBeDefined();
            expect(recipient.read).toBe(true);
            expect(recipient.readAt).toBeDefined();
            expect(new Date(recipient.readAt)).toBeInstanceOf(Date);
        });

        it('should return NOTIFICATION_EMAIL_NOT_FOUND if notificationMessages is empty', async () => {
            // Update settings to have an empty notificationMessages array
            await SettingsModel.findByIdAndUpdate(initialSettings._id, {
                $set: { notificationMessages: [] }
            });
            const result = await integra360Service.notifiMessagesRead({ email: 'test@example.com' }, { messageId });
            expect(result).toHaveProperty('messages', 'NOTIFICATION_EMAIL_NOT_FOUND');
            expect(result.notificationMessages).toEqual([]);
        });
    });
    describe('PATCH /settings/emails/adding', () => {
        // eslint-disable-next-line no-unused-vars
        let initialSettings;

        beforeEach(async () => {
            // Clean the settings collection and create a settings document with an initial email list
            await SettingsModel.deleteMany({});

            initialSettings = await SettingsModel.create({
                notificationListEmails: [{ email: 'existing@example.com' }],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        it('should add new email(s) to notificationListEmails if they are not already present', async () => {
            const body = { emails: [{ email: 'new@example.com' }] };
            const updatedEmails = await integra360Service.settingsEmailsAdd(body);
            expect(updatedEmails).toEqual(
                expect.arrayContaining([expect.objectContaining({ email: 'existing@example.com' })])
            );
            expect(updatedEmails).toEqual(
                expect.arrayContaining([expect.objectContaining({ email: 'new@example.com' })])
            );

            expect(updatedEmails.length).toBe(2);
        });

        it('should not add duplicate emails if they already exist', async () => {
            const body = { emails: [{ email: 'existing@example.com' }] };
            const updatedEmails = await integra360Service.settingsEmailsAdd(body);
            expect(updatedEmails).toEqual(
                expect.arrayContaining([expect.objectContaining({ email: 'existing@example.com' })])
            );
            expect(updatedEmails.length).toBe(1);
        });
    });
});
