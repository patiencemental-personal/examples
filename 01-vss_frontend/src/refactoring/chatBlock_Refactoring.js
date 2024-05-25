import React from 'react';
import DateDivider from '../components/competition/chat/DateDivider';
import AdminChat from '../components/competition/chat/AdminChat';
import UserChat from '../components/competition/chat/UserChat';
import moment from 'moment/moment';
import 'moment/locale/ko'; 

export const setDefaultBodyType = {
  notice() {
    return { body: "이곳은 대회 운영과 관련하여 주요사항이 전달되는 곳입니다.", time: "2022-11-03T24:00:00" }
  },
  help() {
    return { body: "대회와 관련한 모든 궁금한 사항을 자유롭게 물어보세요", time: "2022-11-03T24:00:00" }
  },
  scrum() {
    return { body: "대회에 신청한 팀들과 자유롭게 스크림을 해보세요.", time: "2022-11-03T24:00:00" }
  },
  job() {
    return { body: "‘팀원’이 부족하거나 ‘팀’을 구하고 있는 사람은 이곳에서 자유롭게 팀을 찾아보세요.", time: "2022-11-03T24:00:00" }
  }
}

const dataSetting = {
  notice(info, infoReply, newData) {
    info.forEach((notice) => {
      newData = [...newData, {
        type: 'notice',
        ...notice
      }];
    });
    return newData;
  },
  help(info, infoReply, newData) {
    info.forEach((question) => {
      const { question_index, nickname, body } = question;
      newData = [...newData, {
        type: 'question',
        ...question
      }];

      if (infoReply !== undefined) {
        const replys = infoReply[String(question_index)];
        if (replys !== undefined) {
          replys.reply.forEach(REPLY => {
            newData = [...newData, {
              type: 'reply',
              to: nickname,
              question: body,
              ...REPLY
            }];
          })
        }
      }
    });
    return newData;
  },
  scrum(info, infoReply, newData) {
    info.forEach((scrim) => {
      const { scrim_index, nickname, body } = scrim;
      newData = [...newData, {
        type: 'question',
        ...scrim
      }];

      if (infoReply !== undefined) {
        const replys = infoReply[String(scrim_index)];
        if (replys !== undefined) {
          replys.reply.forEach(REPLY => {
            newData = [...newData, {
              type: 'scrimRecruitReply',
              to: nickname,
              question: body,
              ...REPLY
            }];
          })
        }
      }
    });
    return newData;
  },
  job(info, infoReply, newData) {
    info.forEach((recruit) => {
      const { recruit_index, nickname, body } = recruit;
      newData = [...newData, {
        type: 'question',
        ...recruit
      }];

      if (infoReply !== undefined) {
        const replys = infoReply[String(recruit_index)];
        if (replys !== undefined) {
          replys.reply.forEach(REPLY => {
            newData = [...newData, {
              type: 'scrimRecruitReply',
              to: nickname,
              question: body,
              ...REPLY
            }];
          })
        }
      }
    });
    return newData;
  }
}

export function getInfoType(info, infoReply, selectedMenu) {
  const newData = [];
  const result = dataSetting[selectedMenu](info, infoReply, newData);
  return result;
}

export function sortData(arrayData) {
  return arrayData.sort(function (b, a) {
    return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
  });
}

export function setChatType(data, item, index, selectedMenu, logined, PostReply, deleteData, lastChatRef, scrollToBottomInChatSpace) {
  if(index === data.length-1) {
    if (item?.type === "notice") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <AdminChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} AdminChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <AdminChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} AdminChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      }
    } else if (item?.type === "reply") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <AdminChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} AdminChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <AdminChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} AdminChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      }
    } else if (item?.type === "question") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <UserChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} UserChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <UserChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} UserChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      }
    } else if (item?.type === "scrimRecruitReply") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={index}>
            <UserChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} UserChatRef={lastChatRef}  scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <UserChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} UserChatRef={lastChatRef} scrollToBottomInChatSpace={scrollToBottomInChatSpace} />
          </div>
        )
      }
    } else {
      return <React.Fragment key={new Date().getTime() + index}></React.Fragment>
    }
  } else {
    if (item?.type === "notice") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <AdminChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <AdminChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      }
    } else if (item?.type === "reply") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <AdminChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <AdminChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      }
    } else if (item?.type === "question") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={new Date().getTime() + index}>
            <UserChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <UserChat selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      }
    } else if (item?.type === "scrimRecruitReply") {
      if (index !== 0 && moment(item.time).format('LL') === moment(data[index - 1].time).format('LL')) {
        return (
          <div key={index}>
            <UserChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      } else {
        return (
          <div key={new Date().getTime() + index}>
            <DateDivider date={`${moment(item.time).format('LL')}`} />
            <UserChat reply={{ to: item.to, question: item.question }} selectedMenu={selectedMenu} data={item} isLogined={logined} replyFunction={PostReply} deleteFunction={deleteData} />
          </div>
        )
      }
    } else {
      return <React.Fragment key={new Date().getTime() + index}></React.Fragment>
    }
  }
}