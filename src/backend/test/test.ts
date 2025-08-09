import Profile from '../class/Profile.ts';

export default class Test {
  static async initTest() {
    try {
      const profile = await Profile._list();
      if(!profile){
        return null;
      }
      return profile.map(elem => elem.toJSON());
    } catch(err : any) {
      console.error(err);
      throw new Error(err.message);
    }

  }
}