import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          StoryArea(),
          FeedList(),
        ],
      ),
    );
  }
}

class StoryArea extends StatelessWidget {
  const StoryArea({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children:
            List.generate(10, (index) => UserStory(userName: 'User $index')),
      ),
    );
  }
}

class UserStory extends StatelessWidget {
  final String userName;

  const UserStory({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            margin: EdgeInsets.symmetric(
              vertical: 8,
              horizontal: 8,
            ),
            decoration: BoxDecoration(
                color: Colors.blue.shade300,
                borderRadius: BorderRadius.circular(40)),
          ),
          Text(userName),
        ],
      ),
    );
  }
}

class FeedData {
  final String userName;
  final int likeCount;
  final String content;

  FeedData({
    required this.userName,
    required this.likeCount,
    required this.content,
  });
}

final feedDataList = [
  FeedData(userName: 'User1', likeCount: 50, content: '오늘 점심은 맛있었다.'),
  FeedData(userName: 'User2', likeCount: 24, content: '오늘 아침은 맛있었다.'),
  FeedData(userName: 'User3', likeCount: 82, content: '오늘 저녁은 맛있었다.'),
  FeedData(userName: 'User4', likeCount: 92, content: '어제 점심은 맛있었다.'),
  FeedData(userName: 'User5', likeCount: 43, content: '어제 아침은 맛있었다.'),
  FeedData(userName: 'User6', likeCount: 72, content: '어제 저녁은 맛있었다.'),
  FeedData(userName: 'User7', likeCount: 3, content: '오늘 점심은 맛있었다.'),
  FeedData(userName: 'User8', likeCount: 0, content: '오늘 점심은 맛있었다.'),
  FeedData(userName: 'User9', likeCount: 24, content: '오늘 점심은 맛있었다.'),
];

class FeedList extends StatelessWidget {
  const FeedList({super.key});

  @override
  Widget build(BuildContext context) {
    /**
     * 스크롤 가능한 항목 목록을 표시하는 데 사용됨
     * 데이터(정적 / 동적) 표시 가능
     * 언제 사용? 항목의 수가 많거나, 사용자의 인터랙션에 따라 변할 때 유용
     * 리스트뷰는 가능한 많은 공간을 차지하려고 하고 스크롤 가능한 영역을 만듬
     */
    return ListView.builder(
      // ListView 자신이 포함하고 있는 항목들의 전체 길이 만큼만 공간을 차지
      shrinkWrap: true,
      // physics은 스크롤 동작을 어떻게 처리할지 정의. NeverScrollableScrollPhysics은 리스트뷰가 스크롤되지 않도록 함.
      physics: const NeverScrollableScrollPhysics(),
      itemCount: feedDataList.length,
      // itemBuilder: (context, index) => Text('$index'),
      itemBuilder: (context, index) => FeedItem(feedData: feedDataList[index]),
    );
  }
}

class FeedItem extends StatelessWidget {
  final FeedData feedData;

  const FeedItem({super.key, required this.feedData});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    height: 40,
                    width: 40,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.blue.shade300,
                    ),
                  ),
                  const SizedBox(
                    width: 8,
                  ),
                  Text(feedData.userName),
                ],
              ),
              Icon(Icons.more_vert),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          height: 280,
          color: Colors.indigo.shade300,
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4, horizontal: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.favorite_outline),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(CupertinoIcons.chat_bubble),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(CupertinoIcons.paperplane),
                  ),
                ],
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(CupertinoIcons.bookmark),
              ),
            ],
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: Text(
            '좋아요 ${feedData.likeCount}개',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 4, horizontal: 24),
          child: RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: feedData.userName,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                TextSpan(text: feedData.content),
              ],
              style: TextStyle(color: Colors.black),
            ),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}
