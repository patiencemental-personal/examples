import 'dart:math';

import 'package:fastcampus_flutter_firebase/main.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';

class FirebaseAnalyticsPage extends StatefulWidget {
  const FirebaseAnalyticsPage({Key? key}) : super(key: key);

  @override
  State<FirebaseAnalyticsPage> createState() => _FirebaseAnalyticsPageState();
}

class _FirebaseAnalyticsPageState extends State<FirebaseAnalyticsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Firebase Analytics 테스트"),
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () async {
              var price = Random().nextInt(15).toDouble();
              await FirebaseAnalytics.instance.logBeginCheckout(
                  value: price,
                  currency: 'USD',
                  items: [
                    AnalyticsEventItem(
                      itemName: 'Socks',
                      itemId: 'xjw73ndnw',
                      price: price,
                    ),
                  ],
                  coupon: '10PERCENTOFF');
            },
            child: Text("구매"),
          ),
          ButtonBar(
            children: [
              ElevatedButton(
                  onPressed: () async {
                    await FirebaseAnalytics.instance.logSelectContent(
                      contentType: "image",
                      itemId: "123456",
                    );
                  },
                  child: Text("logSelectContent")),
              ElevatedButton(
                  onPressed: () async {
                    await FirebaseAnalytics.instance.logEvent(
                      name: "select_content",
                      parameters: {
                        "content_type": "image",
                        "item_id": "voucher00000",
                      },
                    );
                  },
                  child: Text("logEvent")),
              ElevatedButton(
                  onPressed: () async {
                    await FirebaseAnalytics.instance.logEvent(
                      name: "share_image",
                      parameters: {
                        "image_name": "jello",
                        "full_text": "world",
                      },
                    );
                  },
                  child: Text("logEvent")),
              ElevatedButton(
                  onPressed: () async {
                    await FirebaseAnalytics.instance.setUserProperty(
                        name: 'favorite', value: '플러터최고');
                  },
                  child: Text("사용자 속성 설정")),
            ],
          )
        ],
      ),
    );
  }
}
