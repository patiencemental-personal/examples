// import 'package:flutter/material.dart';
//
// void main() {
//   runApp(
//     MaterialApp(
//       home: Scaffold(
//         appBar: AppBar(
//           title: Text('Study to Container'),
//         ),
//         body: CustomContainer(),
//       ),
//     ),
//   );
// }
//
// class CustomContainer extends StatelessWidget {
//   const CustomContainer({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return Center(
//       child: Container(
//         // width: double.infinity,
//         // height: double.infinity,
//         // color: Colors.red.shade200,
//         width: 300,
//         height: 300,
//         padding: EdgeInsets.fromLTRB(10, 12, 10, 12),
//         // margin: EdgeInsets.symmetric(vertical: 24, horizontal: 30),
//         decoration: BoxDecoration(
//           color: Color(0xFF85D07B),
//           border: Border.all(color: Colors.red, width: 5, style: BorderStyle.solid),
//           borderRadius: BorderRadius.circular(150),
//           boxShadow: [
//             BoxShadow(color: Colors.black.withOpacity(0.3), offset: Offset(6, 6), blurRadius: 10, spreadRadius: 10),
//             BoxShadow(color: Colors.blue.withOpacity(0.3), offset: Offset(-6, -6), blurRadius: 10, spreadRadius: 10)
//           ],
//         ),
//         child: Center(
//           child: Container(
//             color: Colors.yellow.shade200,
//             child: Text(
//               'Hello Container',
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("Widget을 상하로 배치하기"),),
      ),
    )
  );
}
