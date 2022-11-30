/* eslint-disable linebreak-style */
/* eslint-disable linebreak-style */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-curly-spacing */
const mongoose = require('mongoose');
// const supertest = require('supertest');
// const app = require('./db_backend.js');
// const userModel = require('./models/user.js');
const userServices = require('./models/user-services.js');
// const mediaModel = require('./models/media.js');
const mediaServices = require('./models/media-services.js');

// ######################### Startup #########################

describe('Connection', () => {
  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    testUser = await userServices.addUser({
      email: 'testuser',
      password: 'testpswd',
      mediaList: [
        {
          mediaId: 'testId',
          currentSeason: 1,
          currentEpisode: 5,
          currentHours: 3,
          currentMinutes: 7,
        },
      ],
    });
    testMedia = await mediaServices.addMedia({
      name: 'testmed',
      contentType: 'testType',
      streamingService: 'testStrmsrv',
      img: 'testImg',
      desc: 'testDesc',
    });
  });

  // #################### User and userServices Tests ####################

  // test('test getUsers - all', async () => {
  //   const result = await userServices.getUsers();
  //   expect(result[result.length - 1].email).toBe('testuser');
  //   expect(result[result.length - 1].password).toBe('testpswd');
  //   expect(result[result.length - 1].mediaList[0]).
  //       toStrictEqual(testUser.mediaList[0]);
  // });

  // test('test getUsers - email', async () => {
  //   const result = await userServices.getUsers('testuser', null, null);
  //   console.log(result);
  //   expect(result[0].email).toBe('testuser');
  // });

  // test('test getUsers - password', async () => {
  //   const result = await userServices.getUsers(null, 'testpswd', null);
  //   expect(result[0].email).toBe('testuser');
  // });

  // test('test getUsers - mediaList', async () => {
  //   const result = await userServices.getUsers(null, null, [
  //     { mediaId: 'testId',
  //       currentSeason: 1,
  //       currentEpisode: 5,
  //       currentHours: 3,
  //       currentMinutes: 7 },
  //   ]);
  //   expect(result[0].email).toBe('testuser');
  // });

  // test('test findByUserId - success', async () => {
  //   const result = await userServices.findUserById(testUser.id);
  //   expect(result.email).toBe('testuser');
  // });

  // test('test findByUserId - failure', async () => {
  //   const result = await userServices.findUserById('invalid ID');
  //   expect(result).toBe(undefined);
  // });

  // test('test addUser - password too short', async () => {
  //   const result = await userServices.addUser(
  //       {
  //         email: 'normal',
  //         password: 'bad',
  //         mediaList: [] });
  //   expect(result).toBeFalsy();
  // });

  // test('test addUser - password too long', async () => {
  //   const result = await userServices.addUser(
  //       {
  //         email: 'normal',
  //         password: 'badbadbadbadbadbadbadbad',
  //         mediaList: [] });
  //   expect(result).toBeFalsy();
  // });

  // // skip modUser for now

  // test('test patchUser - add and remove', async () => {
  //   const objToMod = {
  //     email: 'testuser2',
  //     password: 'testpswd2',
  //     mediaList: [
  //       {
  //         mediaId: testUser.mediaList[0].mediaId,
  //         currentSeason: testUser.mediaList[0].currentSeason,
  //         currentEpisode: testUser.mediaList[0].currentEpisode,
  //         currentHours: testUser.mediaList[0].currentHours,
  //         currentMinutes: testUser.mediaList[0].currentMinutes,
  //       },
  //       {
  //         mediaId: 'testMedId2',
  //         currentHours: 4,
  //         currentMinutes: 8,
  //       },
  //     ],
  //   };
  //   const result = await userServices.patchUser(testUser.id, objToMod);
  //   expect(result.mediaList[0].mediaId).toBe('testMedId2');
  //   expect(result.mediaList[0].currentSeason).toBe(undefined);
  //   expect(result.mediaList[0].currentEpisode).toBe(undefined);
  //   expect(result.mediaList[0].currentHours).toBe(4);
  //   expect(result.mediaList[0].currentMinutes).toBe(8);
  //   expect(result.mediaList[1]).toBe(undefined);
  // });

  // test('test patchUser - failure to find target', async () => {
  //   console.log('test patchUser fail find');
  //   const result = await userServices.patchUser('badId', null);
  //   console.log(result);
  //   expect(result).toBe(undefined);
  // });

  test('test patchUser - failure to update', async () => {
    const oldEmail = testUser.email;
    const objToMod = {
      email: 'testuser2',
      password: 'badpswdnot',
      mediaList: [
        {
          mediaId: testUser.mediaList[0].mediaId,
          currentSeason: testUser.mediaList[0].currentSeason,
          currentEpisode: testUser.mediaList[0].currentEpisode,
          currentHours: testUser.mediaList[0].currentHours,
          currentMinutes: testUser.mediaList[0].currentMinutes,
        },
        {
          mediaId: 'testMedId2',
          currentHours: 4,
          currentMinutes: 8,
        },
      ],
    };
    const result = await userServices.patchUser(testUser.id, objToMod);
    expect(result.email).toBe(oldEmail);
  });

  // test('test patchUser - update success', async () => {
  //   const objToMod = {
  //     email: 'testuser2',
  //     password: 'testpswd2',
  //     mediaList: [
  //       {
  //         mediaId: 'testId',
  //         currentSeason: 2,
  //         currentEpisode: 6,
  //         currentHours: 4,
  //         currentMinutes: 8,
  //       },
  //     ],
  //   };
  //   const result = await userServices.patchUser(testUser.id, objToMod);
  //   expect(result.email).toBe('testuser2');
  //   expect(result.password).toBe('testpswd2');
  //   expect(result.mediaList[0].mediaId).toBe('testId');
  //   expect(result.mediaList[0].currentSeason).toBe(2);
  //   expect(result.mediaList[0].currentEpisode).toBe(6);
  //   expect(result.mediaList[0].currentHours).toBe(4);
  //   expect(result.mediaList[0].currentMinutes).toBe(8);
  // });

  // test('test findByIdAndDelete - success', async () => {
  //   const target = testUser.name;
  //   const result = await userServices.findByIdAndDelete(testUser.id);
  //   expect(target).toBe(result.name);
  // });

  // test('test findByIdAndDelete - failure', async () => {
  //   const result = await userServices.findByIdAndDelete('INVALID ID');
  //   expect(result).toBeFalsy();
  // });

  // // #################### Media and mediaServices Tests ####################

  // test('test getMedia - all', async () => {
  //   const result = await mediaServices.getMedia();
  //   expect(result[result.length - 1].name).toBe('testmed');
  //   expect(result[result.length - 1].contentType).toBe('testType');
  //   expect(result[result.length - 1].streamingService).toBe('testStrmsrv');
  //   expect(result[result.length - 1].img).toBe('testImg');
  //   expect(result[result.length - 1].desc).toBe('testDesc');
  // });

  test('test getMedia - name', async () => {
    const result = await mediaServices.getMedia('testmed', null, null, null, null);
    expect(result[0].name).toBe('testmed');
  });

  test('test getMedia - contentType', async () => {
    const result = await mediaServices.getMedia(null, 'testType', null, null, null);
    expect(result[0].name).toBe('testmed');
  });

  test('test getMedia - streamingService', async () => {
    const result = await mediaServices.getMedia(null, null, 'testStrmsrv', null, null);
    expect(result[0].name).toBe('testmed');
  });

  test('test getMedia - img', async () => {
    const result = await mediaServices.getMedia(null, null, null, 'testImg', null);
    expect(result[0].name).toBe('testmed');
  });

  test('test getMedia - desc', async () => {
    const result = await mediaServices.getMedia(null, null, null, null, 'testDesc');
    expect(result[0].name).toBe('testmed');
  });

  // test('test findByMediaId - success', async () => {
  //   const result = await mediaServices.findMediaById(testMedia.id);
  //   expect(result.name).toBe('testmed');
  // });

  // test('test findByMediaId - failure', async () => {
  //   const result = await mediaServices.findMediaById('invalid ID');
  //   expect(result).toBe(undefined);
  // });

  // test('test addUser - failure', async () => {
  //   const result = await mediaServices.addMedia({});
  //   expect(result).toBeFalsy();
  // });

  // test('test findByIdAndDelete - success', async () => {
  //   const target = testMedia.name;
  //   const result = await mediaServices.findByIdAndDelete(testMedia.id);
  //   expect(target).toBe(result.name);
  // });

  // test('test findByIdAndDelete - failure', async () => {
  //   const result = await mediaServices.findByIdAndDelete('INVALID ID');
  //   expect(result).toBeFalsy();
  // });

  // ######################## Cleanup ########################

  afterEach(async () => {
    await userServices.findByIdAndDelete(testUser.id);
    await mediaServices.findByIdAndDelete(testMedia.id);
  });

  afterAll(async () => {
    mongoose.disconnect();
  });
});
