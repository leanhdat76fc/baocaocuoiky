import { createContext,useContext,useMemo,useReducer } from "react";
import { firestore } from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
const MyContext = createContext()
MyContext.displayName="Mystore"
const reducer = (state, action)=>{
    switch(action.type)
    {
        case "USER_LOGIN":
            return {...state,userLogin: action.value}
        case "LOGOUT":
            return {...state,userLogin: null}
        default :{
            throw new Error("Action ko ton tai")
        }
    }
}

const Todo = ({id,title,complete}) => {
    async function toggleComplete(){
        await firestore()
            .collection('todos')
            .doc(id)
            .update({
                complete: !complete,
            })
    }
  return (
    <List.Item
        title={title}
        onPress={() =>toggleComplete()}
        left={props =>(
            <List.Icon {...props} icon={complete ? 'check' : 'cancel'}></List.Icon>
        )}
    >

    </List.Item>
  )
}

const MyContextControllerProvider = ({children})=>{
    const initialState= {
        userLogin: null,
        jobs: []
    } 
    const [controller, dispatch] = useReducer (reducer, initialState)
    const value = useMemo (() => [controller, dispatch])
    return(
        <MyContext.Provider value={value}> 
        {children}
        </MyContext.Provider>
    )
}
    //
const useMyContextProvider = () =>{
    const context = useContext(MyContext)
    if(!context)
    {
        return new Error("useMyContextProvider phai dat trong MyContextControllerProvider")
    }
    return context
}


const USERS = firestore().collection("USERS")
const createAccount= (email, password, fullName )=>{ 
    auth().createUserWithEmailAndPassword (email, password)
    .then(()=>{
        Alert.alert("Tao tai khoan thanh cong voi email:" + email)
        USERS.doc(email)
        .set(
            {
                email,
                password,
                fullName,
            }
        )
    })
    .catch(e => console.log(e.message))
}
const login = (dispatch, email, password, fullname) =>{ 
    auth().signInwithEmailAndPassword (email, password)
    .then(() => {
        USERS.doc (email) 
        .onSnapshot (u=> { 
            if(u.exists)
            {
            console.log("Dang nhap thanh cong voi :" + u.id) 
            dispatch({type: "USER_LOGIN", value: u.data()})
            }
        })
    })
    .catch(e => Alert.alert("Sai email va password"))
}

const logout =(dispatch) => {
    auth().signOut()
    .then(()=> dispatch({type:"LOGOUT"}))
}

const [values, setValues] = useState({ fullname: '', email: '', password: '', confirmPassword: '' });



const loginSubmit = () => {
    if (!values.email || !values.password) {
        Alert.alert("All fields are required");
        return;
    }
    auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(() => {
setValues({ email: '', password: '' });
            navigation.navigate('Home');
        })
        .catch(error => {
            let errorMessage = "An error occurred. Please try again.";
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                errorMessage = "Invalid email or password.";
            }
            Alert.alert("Error", errorMessage);
        });
};



export {
    MyContextControllerProvider,
    useMyContextProvider,
    createAccount,
    login,
    loginSubmit,
    logout,
    Todo,
}