import conf from '../conf/conf.js'
import { Client, Account, ID} from 'appwrite';


console.log("Loaded config:", conf);

export class AuthService{
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
    }
    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if(userAccount){
                // call another method
                return this.login({email, password})
            }
            return null
        }catch(error){
            throw new Error(`AuthService::createAccount failed - ${error.message}`);
        }
    }
    async login({email, password}){
        try{
            return await this.account.createEmailPasswordSession(email, password)
        }
        catch(error){
            throw new Error(`AuthService::login failed - ${error.message}`)
        }
    }
    async getCurrentUser(){
        try{
            return await this.account.get()
        }catch(error){
            console.log("Appwrite Service: getCurrentUser :: error", error)
        }
        return null
    }
    async logout(){
        try{
             await this.account.deleteSessions()
        }catch(error){
            console.log("Appwrite Service: logout :: error", error)
        }
    }
}
const authService = new AuthService();
export default authService;