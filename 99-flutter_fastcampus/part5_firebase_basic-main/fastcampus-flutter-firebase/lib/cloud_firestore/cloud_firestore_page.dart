import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class CloudFirestorePage extends StatefulWidget {
  const CloudFirestorePage({Key? key}) : super(key: key);

  @override
  State<CloudFirestorePage> createState() => _CloudFirestorePageState();
}

class _CloudFirestorePageState extends State<CloudFirestorePage> {
  final db = FirebaseFirestore.instance;
  int _counter = 0;
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Cloud Firestore"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: IndexedStack(
          index: _index,
          children: [
            ListView(
              children: [
                const Text(
                  "데이터타입 다루기",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 32,
                  ),
                ),
                ElevatedButton(
                  onPressed: () async {
                    final docData = {
                      "stringType": "Hello world!",
                      "booleanType": true,
                      "numberType": 3.14159265,
                      "dateType": Timestamp.now(),
                      "listType": [1, 2, 3],
                      "nullType": null,
                      "geo": const GeoPoint(36.15, 128.15),
                    };

                    final nestedData = {
                      "a": 5,
                      "b": true,
                    };

                    docData["objectMapType"] = nestedData;
                    await db.collection("types").add(docData);
                  },
                  child: const Text("추가하기"),
                ),
                const Divider(),
                const Text(
                  "카운터 다루기",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 32,
                  ),
                ),
                Text(
                  "$_counter",
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                ButtonBar(
                  children: [
                    ElevatedButton(
                      onPressed: () async {
                        final resp = await db.collection("/counter").add(
                          {
                            "value": _counter,
                            "timestamp": DateTime.now().millisecondsSinceEpoch,
                          },
                        );
                        await db.collection("/counter").doc('statics').set(
                          {
                            "value": _counter,
                            "timestamp": DateTime.now().millisecondsSinceEpoch,
                          },
                        );
                        print(resp);
                      },
                      child: const Text("추가하기(Create)"),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        List tmpItems = [];
                        final qSnapshot = await db.collection("counter").get();
                        for (var element in qSnapshot.docs) {
                          tmpItems.add(element.data());
                        }
                        if (context.mounted) {
                          showModalBottomSheet(
                              context: context,
                              builder: (context) {
                                return ListView.builder(
                                    itemCount: tmpItems.length,
                                    itemBuilder: (context, index) {
                                      return ListTile(
                                          title: Text(
                                              "${tmpItems[index]['value']}"),
                                          subtitle: Text(
                                              "${tmpItems[index]['timestamp']}"));
                                    });
                              });
                        }
                      },
                      child: const Text("읽기(Read)"),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        // await db.collection("/counter").doc('statics').set(
                        //   {
                        //     "value": _counter,
                        //     // "timestamp": DateTime.now().millisecondsSinceEpoch,
                        //   },
                        // );
                        await db.collection("/counter").doc('statics').update(
                          {
                            "value": _counter,
                            "timestamp": Timestamp.now(),
                          },
                        );
                      },
                      child: const Text("업데이트(Update)"),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        await db.collection("/counter").doc('statics').delete();
                        // await db.collection("/counter").doc('statics').update(
                        //   {
                        //     'timestamp': FieldValue.delete(),
                        //   },
                        // );
                      },
                      child: const Text("삭제(Delete)"),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _counter = 0;
                        });
                      },
                      child: const Text("카운터 초기화"),
                    ),
                  ],
                ),
                const Divider(),
              ],
            ),
            Column(
              children: [
                Expanded(
                    child: StreamBuilder(
                  stream: db.collection("events").snapshots(),
                  builder: (BuildContext context,
                      AsyncSnapshot<QuerySnapshot<Map<String, dynamic>>>
                          snapshot) {
                    if (snapshot.hasData) {
                      if (snapshot.data?.docs.isEmpty ?? false) {
                        return const Center(
                          child: Text("데이터가 없습니다."),
                        );
                      }
                      final items = snapshot.data?.docs ?? [];

                      return ListView.separated(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          return Dismissible(
                            key: UniqueKey(),
                            onDismissed: (event) {
                              switch (event) {
                                case DismissDirection.vertical:
                                // TODO: Handle this case.
                                case DismissDirection.horizontal:
                                // TODO: Handle this case.
                                case DismissDirection.endToStart:
                                  // TODO: Handle this case.
                                  print('delete');
                                case DismissDirection.startToEnd:
                                // TODO: Handle this case.

                                case _:
                              }
                            },
                            confirmDismiss: (e) async {
                              return await showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: const Text('Delete'),
                                  content:
                                      const Text('Are you sure to delete?'),
                                  actions: [
                                    TextButton(
                                        child: const Text("No"),
                                        onPressed: () =>
                                            Navigator.pop(context, false)),
                                    TextButton(
                                        child: const Text("Yes"),
                                        onPressed: () async {
                                          print(items[index].id);
                                          await db
                                              .collection("events")
                                              .doc(items[index].id)
                                              .delete();
                                          Navigator.pop(context, true);
                                        }),
                                  ],
                                ),
                              );
                            },
                            child: ListTile(
                              title: Text("${items[index]['title']}"),
                              trailing: Text("${items[index]['price']}"),
                              subtitle: Text("${items[index]['location']}"),
                            ),
                          );
                        },
                        separatorBuilder: (context, _) => const Divider(),
                      );
                    }
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  },
                )
                    // FutureBuilder(
                    //   future: db.collection("events").get(),
                    //   builder: (BuildContext context,
                    //       AsyncSnapshot<QuerySnapshot<Map<String, dynamic>>>
                    //           snapshot) {
                    //     if (snapshot.hasData) {
                    //       if (snapshot.data?.docs.isEmpty ?? false) {
                    //         return const Center(
                    //           child: Text("데이터가 없습니다."),
                    //         );
                    //       }
                    //       final items = snapshot.data?.docs ?? [];
                    //
                    //       return ListView.separated(
                    //         itemCount: items.length,
                    //         itemBuilder: (context, index) {
                    //           return ListTile(
                    //             title: Text("${items[index]['title']}"),
                    //             trailing: Text("${items[index]['price']}"),
                    //             subtitle: Text("${items[index]['location']}"),
                    //           );
                    //         },
                    //         separatorBuilder: (context, _) => const Divider(),
                    //       );
                    //     }
                    //     return const Center(
                    //       child: CircularProgressIndicator(),
                    //     );
                    //   },
                    // ),
                    ),
                MaterialButton(
                  color: Colors.blueAccent,
                  minWidth: double.infinity,
                  child: const Text("추가하기"),
                  height: 48,
                  onPressed: () async {
                    db.collection("events").doc("A").set(
                      {
                        "title": "최고의 콘서트 A",
                        "location": "서울",
                        "price": 10000,
                      },
                    );
                    db.collection("events").doc("B").set(
                      {
                        "title": "10년만의 복귀 콘서트 B",
                        "location": "서울",
                        "price": 20000,
                      },
                    );
                    db.collection("events").doc("C").set(
                      {
                        "title": "토크 콘서트",
                        "location": "서울",
                        "price": 0,
                      },
                    );
                    db.collection("events").doc("D").set(
                      {
                        "title": "여름 콘서트",
                        "location": "경기",
                        "price": 80000,
                      },
                    );
                    List.generate(
                      10,
                      (index) => db
                          .collection("events")
                          .doc("C")
                          .collection("CC")
                          .doc("CC$index")
                          .set(
                        {
                          "title": "",
                          "location": "서울",
                          "price": Random().nextInt(30000) + 10000,
                        },
                      ),
                    );
                    // db
                    //     .collection("events")
                    //     .doc("C")
                    //     .collection("CC")
                    //     .doc("CC0")
                    //     .set(
                    //   {
                    //     "title": "",
                    //     "location": "서울",
                    //     "price": 30000,
                    //   },
                    // );
                    // db
                    //     .collection("events")
                    //     .doc("C")
                    //     .collection("CC")
                    //     .doc("CC1")
                    //     .set(
                    //   {
                    //     "title": "",
                    //     "location": "서울",
                    //     "price": 30000,
                    //   },
                    // );
                  },
                ),
                const SizedBox(
                  height: 16,
                ),
                Row(
                  children: [
                    Expanded(
                      child: MaterialButton(
                        color: Colors.blueAccent,
                        child: const Text("트렌젝션"),
                        height: 48,
                        onPressed: () async {},
                      ),
                    ),
                    const SizedBox(
                      width: 16,
                    ),
                    Expanded(
                      child: MaterialButton(
                        color: Colors.blueAccent,
                        child: const Text("Batch"),
                        height: 48,
                        onPressed: () async {},
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
      endDrawer: const Drawer(),
      drawerEnableOpenDragGesture: false,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (idx) {
          setState(() {
            _index = idx;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.add_box_outlined),
            label: "기초 카운터",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.emoji_events_outlined),
            label: "이벤트",
          )
        ],
      ),
      floatingActionButton: switch (_index) {
        0 => FloatingActionButton(
            onPressed: () async {
              setState(() {
                _counter++;
              });
            },
            child: const Icon(Icons.add),
          ),
        _ => Container(),
      },
    );
  }
}
