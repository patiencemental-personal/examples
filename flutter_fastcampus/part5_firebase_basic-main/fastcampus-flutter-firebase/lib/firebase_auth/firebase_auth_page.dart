import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class FirebaseAuthPage extends StatefulWidget {
  const FirebaseAuthPage({Key? key}) : super(key: key);

  @override
  State<FirebaseAuthPage> createState() => _FirebaseAuthPageState();
}

class _FirebaseAuthPageState extends State<FirebaseAuthPage> {
  final auth = FirebaseAuth.instance;

  TextEditingController emailTextEditingController = TextEditingController();
  TextEditingController pwdTextEditingController = TextEditingController();
  bool isSignUp = false;
  User? user;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  Future<UserCredential> signInWithGoogle() async {
    // Trigger the authentication flow
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

    // Obtain the auth details from the request
    final GoogleSignInAuthentication? googleAuth =
        await googleUser?.authentication;

    // Create a new credential
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth?.accessToken,
      idToken: googleAuth?.idToken,
    );

    // Once signed in, return the UserCredential
    return await FirebaseAuth.instance.signInWithCredential(credential);
  }

  Future signUpEmailAndPassword() async {
    // auth.signInWithProvider(GoogleAuthProvider());
    try {
      final email = emailTextEditingController.text.trim();
      final pwd = pwdTextEditingController.text.trim();
      final credential = await auth.createUserWithEmailAndPassword(
          email: email, password: pwd);
      print("SignUp: ${credential.toString()}");
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');
      } else if (e.code == 'email-already-in-use') {
        print('The account already exists for that email.');
      }
    } catch (e) {
      print(e);
    }
  }

  Future signInEmailAndPassword() async {
    try {
      final email = emailTextEditingController.text.trim();
      final pwd = pwdTextEditingController.text.trim();
      final credential =
          await auth.signInWithEmailAndPassword(email: email, password: pwd);
      // print(credential.toString());
      print("SignIn: ${credential.toString()}");

      setState(() {
        user = credential.user;
      });

    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');
      } else if (e.code == 'email-already-in-use') {
        print('The account already exists for that email.');
      }
    } catch (e) {
      print(e);
    }
  }

  signOut() async {
    await auth.signOut();
    user = null;
  }

  signInAnonymously() async {
    try {
      final userCredential = await FirebaseAuth.instance.signInAnonymously();
      print("Signed in with temporary account.");
    } on FirebaseAuthException catch (e) {
      switch (e.code) {
        case "operation-not-allowed":
          print("Anonymous auth hasn't been enabled for this project.");
          break;
        default:
          print("Unknown error.");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Firebase 인증 실습"),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 84,
            child: StreamBuilder(
              stream: auth.authStateChanges(),
              builder: (BuildContext context, AsyncSnapshot<User?> snapshot) {
                if (snapshot.hasData) {
                  String result = "";
                  if (snapshot.data == null) {
                    result = 'User is currently signed out!';
                    print('User is currently signed out!');
                  } else {
                    result = 'User is signed in!';
                    print('User is signed in!');
                  }

                  return Column(
                    children: [
                      Text(result),
                      Text(snapshot.data?.uid ?? "udi: null")
                    ],
                  );
                }
                if (snapshot.hasError) {
                  print("snapshot.hasError");
                  return Container();
                }
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: MaterialButton(
              onPressed: () {},
              color: Colors.blueAccent,
              minWidth: double.infinity,
              height: 48,
              child: const Text(
                "익명 로그인",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const Divider(),
          SwitchListTile.adaptive(
              title: const Text("회원가입"),
              value: isSignUp,
              onChanged: (b) {
                setState(() {
                  isSignUp = b;
                });
              }),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: emailTextEditingController,
                      decoration: const InputDecoration(
                        filled: true,
                        hintText: "이메일",
                      ),
                    ),
                    const SizedBox(
                      height: 24,
                    ),
                    TextField(
                      controller: pwdTextEditingController,
                      decoration: const InputDecoration(
                        filled: true,
                        hintText: "비밀번호",
                      ),
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    if (user == null)
                      MaterialButton(
                        height: 48,
                        minWidth: double.infinity,
                        color: Colors.amber,
                        onPressed: () async {
                          if (isSignUp) {
                            signUpEmailAndPassword();
                          } else {
                            signInEmailAndPassword();
                          }
                        },
                        child: Text(
                          switch (isSignUp) {
                            true => "회원가입",
                            false => "로그인",
                          },
                        ),
                      ),
                    const SizedBox(
                      height: 16,
                    ),
                    if (user != null)
                      MaterialButton(
                        height: 48,
                        minWidth: double.infinity,
                        color: Colors.orange,
                        onPressed: () async {
                          await signOut();
                          setState(() {});
                        },
                        child: const Text("로그아웃"),
                      ),
                    TextButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.setLanguageCode("ko");
                        await user?.sendEmailVerification();
                      },
                      child: const Text("이메일 인증"),
                    ),
                    TextButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.sendPasswordResetEmail(
                            email: "park.develop0@gmail.com");
                      },
                      child: const Text("비밀번호 재설정"),
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    GestureDetector(
                      onTap: () async {
                        final googleUser = await signInWithGoogle();
                        setState(() {
                          user = googleUser.user;
                        });
                        print(googleUser);
                      },
                      child: Image.asset(
                        "assets/btn_google_sign_in.png",
                        height: 64,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
