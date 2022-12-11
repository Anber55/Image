/*
涓滀笢姘存灉:鑴氭湰鏇存柊鍦板潃 jd_fruit.js
鏇存柊鏃堕棿锛�2021-5-18
娲诲姩鍏ュ彛锛氫含涓淎PP鎴戠殑-鏇村宸ュ叿-涓滀笢鍐滃満
涓滀笢鍐滃満娲诲姩閾炬帴锛歨ttps://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html
宸叉敮鎸両OS鍙屼含涓滆处鍙�,Node.js鏀寔N涓含涓滆处鍙�
鑴氭湰鍏煎: QuantumultX, Surge, Loon, JSBox, Node.js
浜掑姪鐮乻hareCode璇峰厛鎵嬪姩杩愯鑴氭湰鏌ョ湅鎵撳嵃鍙湅鍒�
涓€澶╁彧鑳藉府鍔�3涓汉銆傚鍑虹殑鍔╁姏鐮佹棤鏁�
==========================Quantumultx=========================
[task_local]
#jd鍏嶈垂姘存灉
5 6-18/6 * * * jd_fruit.js, tag=涓滀笢鍐滃満, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdnc.png, enabled=true
=========================Loon=============================
[Script]
cron "5 6-18/6 * * *" script-path=jd_fruit.js,tag=涓滀笢鍐滃満

=========================Surge============================
涓滀笢鍐滃満 = type=cron,cronexp="5 6-18/6 * * *",wake-system=1,timeout=3600,script-path=jd_fruit.js

=========================灏忕伀绠�===========================
涓滀笢鍐滃満 = type=cron,script-path=jd_fruit.js, cronexpr="5 6-18/6 * * *", timeout=3600, enable=true

jd鍏嶈垂姘存灉 鎼殑https://github.com/liuxiaoyucc/jd-helper/blob/a6f275d9785748014fc6cca821e58427162e9336/fruit/fruit.js
*/
const $ = new Env('涓滀笢鍐滃満');
let cookiesArr = [], cookie = '', jdFruitShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
//鍔╁姏濂藉弸鍒嗕韩鐮�(鏈€澶�3涓�,鍚﹀垯鍚庨潰鐨勫姪鍔涘け璐�),鍘熷洜:浜笢鍐滃満姣忎汉姣忓ぉ鍙湁3娆″姪鍔涙満浼�
//姝ゆ鍐呭鏄疘OS鐢ㄦ埛涓嬭浇鑴氭湰鍒版湰鍦颁娇鐢紝濉啓浜掑姪鐮佺殑鍦版柟锛屽悓涓€浜笢璐﹀彿鐨勫ソ鍙嬩簰鍔╃爜璇蜂娇鐢ˊ绗﹀彿闅斿紑銆�
//涓嬮潰缁欏嚭涓や釜璐﹀彿鐨勫～鍐欑ず渚嬶紙iOS鍙敮鎸�2涓含涓滆处鍙凤級
let shareCodes = [ // 杩欎釜鍒楄〃濉叆浣犺鍔╁姏鐨勫ソ鍙嬬殑shareCode
   //璐﹀彿涓€鐨勫ソ鍙媠hareCode,涓嶅悓濂藉弸鐨剆hareCode涓棿鐢ˊ绗﹀彿闅斿紑
  '0a74407df5df4fa99672a037eec61f7e@dbb21614667246fabcfd9685b6f448f3@6fbd26cc27ac44d6a7fed34092453f77@61ff5c624949454aa88561f2cd721bf6@56db8e7bc5874668ba7d5195230d067a@b9d287c974cc498d94112f1b064cf934@23b49f5a106b4d61b2ea505d5a4e1056@8107cad4b82847a698ca7d7de9115f36',
  //璐﹀彿浜岀殑濂藉弸shareCode,涓嶅悓濂藉弸鐨剆hareCode涓棿鐢ˊ绗﹀彿闅斿紑
  'b1638a774d054a05a30a17d3b4d364b8@f92cb56c6a1349f5a35f0372aa041ea0@9c52670d52ad4e1a812f894563c746ea@8175509d82504e96828afc8b1bbb9cb3@2673c3777d4443829b2a635059953a28@d2d5d435675544679413cb9145577e0f',
]
let message = '', subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//淇濈暀姘存淮澶т簬澶氬皯g,榛樿100g;
let jdNotify = false;//鏄惁鍏抽棴閫氱煡锛宖alse鎵撳紑閫氱煡鎺ㄩ€侊紝true鍏抽棴閫氱煡鎺ㄩ€�
let jdFruitBeanCard = false;//鍐滃満浣跨敤姘存淮鎹㈣眴鍗�(濡傛灉鍑虹幇闄愭椂娲诲姩鏃�100g姘存崲20璞�,姝ゆ椂姣旀祰姘村垝绠�,鎺ㄨ崘鎹㈣眴),true琛ㄧず鎹㈣眴(涓嶆祰姘�),false琛ㄧず涓嶆崲璞�(缁х画娴囨按),鑴氭湰榛樿鏄祰姘�
let randomCount = $.isNode() ? 20 : 5;
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '銆愭彁绀恒€戣鍏堣幏鍙栦含涓滆处鍙蜂竴cookie\n鐩存帴浣跨敤NobyDa鐨勪含涓滅鍒拌幏鍙�', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n寮€濮嬨€愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `銆愭彁绀恒€慶ookie宸插け鏁坄, `浜笢璐﹀彿${$.index} ${$.nickName || $.UserName}\n璇烽噸鏂扮櫥褰曡幏鍙朶nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie宸插け鏁� - ${$.UserName}`, `浜笢璐﹀彿${$.index} ${$.UserName}\n璇烽噸鏂扮櫥褰曡幏鍙朿ookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      option = {};
      await shareCodesFormat();
      await jdFruit();
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
    .catch((e) => {
      $.log('', `鉂� ${$.name}, 澶辫触! 鍘熷洜: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdFruit() {
  subTitle = `銆愪含涓滆处鍙�${$.index}銆�${$.nickName}`;
  try {
    await initForFarm();
    if ($.farmInfo.farmUserPro) {
      // option['media-url'] = $.farmInfo.farmUserPro.goodsImage;
      message = `銆愭按鏋滃悕绉般€�${$.farmInfo.farmUserPro.name}\n`;
      console.log(`\n銆愪含涓滆处鍙�${$.index}锛�${$.UserName}锛夌殑${$.name}濂藉弸浜掑姪鐮併€�${$.farmInfo.farmUserPro.shareCode}\n`);
      console.log(`\n銆愬凡鎴愬姛鍏戞崲姘存灉銆�${$.farmInfo.farmUserPro.winTimes}娆n`);
      message += `銆愬凡鍏戞崲姘存灉銆�${$.farmInfo.farmUserPro.winTimes}娆n`;
      await masterHelpShare();//鍔╁姏濂藉弸
      if ($.farmInfo.treeState === 2 || $.farmInfo.treeState === 3) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `銆愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n銆愭彁閱掆彴銆�${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭鏌ョ湅\n鐐瑰嚮寮圭獥鍗宠揪`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 璐﹀彿${$.index} - ${$.nickName}姘存灉宸插彲棰嗗彇`, `銆愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n銆愭彁閱掆彴銆�${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭鏌ョ湅`);
        }
        return
      } else if ($.farmInfo.treeState === 1) {
        console.log(`\n${$.farmInfo.farmUserPro.name}绉嶆涓�...\n`)
      } else if ($.farmInfo.treeState === 0) {
        //宸蹭笅鍗曡喘涔�, 浣嗘湭寮€濮嬬妞嶆柊鐨勬按鏋�
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `銆愪含涓滆处鍙�${$.index}銆� ${$.nickName || $.UserName}\n銆愭彁閱掆彴銆戞偍蹇樹簡绉嶆鏂扮殑姘存灉\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭閫夎喘骞剁妞嶆柊鐨勬按鏋淺n鐐瑰嚮寮圭獥鍗宠揪`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 鎮ㄥ繕浜嗙妞嶆柊鐨勬按鏋渀, `浜笢璐﹀彿${$.index} ${$.nickName}\n銆愭彁閱掆彴銆戞偍蹇樹簡绉嶆鏂扮殑姘存灉\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭閫夎喘骞剁妞嶆柊鐨勬按鏋渀);
        }
        return
      }
      await doDailyTask();
      await doTenWater();//娴囨按鍗佹
      await getFirstWaterAward();//棰嗗彇棣栨娴囨按濂栧姳
      await getTenWaterAward();//棰嗗彇10娴囨按濂栧姳
      await getWaterFriendGotAward();//棰嗗彇涓�2濂藉弸娴囨按濂栧姳
      await duck();
      await doTenWaterAgain();//鍐嶆娴囨按
      await predictionFruit();//棰勬祴姘存灉鎴愮啛鏃堕棿
    } else {
      console.log(`鍒濆鍖栧啘鍦烘暟鎹紓甯�, 璇风櫥褰曚含涓� app鏌ョ湅鍐滃満0鍏冩按鏋滃姛鑳芥槸鍚︽甯�,鍐滃満鍒濆鍖栨暟鎹�: ${JSON.stringify($.farmInfo)}`);
      message = `銆愭暟鎹紓甯搞€戣鎵嬪姩鐧诲綍浜笢app鏌ョ湅姝よ处鍙�${$.name}鏄惁姝ｅ父`;
    }
  } catch (e) {
    console.log(`浠诲姟鎵ц寮傚父锛岃妫€鏌ユ墽琛屾棩蹇� 鈥硷笍鈥硷笍`);
    $.logErr(e);
    const errMsg = `浜笢璐﹀彿${$.index} ${$.nickName || $.UserName}\n浠诲姟鎵ц寮傚父锛岃妫€鏌ユ墽琛屾棩蹇� 鈥硷笍鈥硷笍`;
    if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
    $.msg($.name, '', `${errMsg}`)
  }
  await showMsg();
}
async function doDailyTask() {
  await taskInitForFarm();
  console.log(`寮€濮嬬鍒癭);
  if (!$.farmTask.signInit.todaySigned) {
    await signForFarm(); //绛惧埌
    if ($.signResult.code === "0") {
      console.log(`銆愮鍒版垚鍔熴€戣幏寰�${$.signResult.amount}g馃挧\\n`)
      //message += `銆愮鍒版垚鍔熴€戣幏寰�${$.signResult.amount}g馃挧\n`//杩炵画绛惧埌${signResult.signDay}澶�
    } else {
      // message += `绛惧埌澶辫触,璇﹁鏃ュ織\n`;
      console.log(`绛惧埌缁撴灉:  ${JSON.stringify($.signResult)}`);
    }
  } else {
    console.log(`浠婂ぉ宸茬鍒�,杩炵画绛惧埌${$.farmTask.signInit.totalSigned},涓嬫绛惧埌鍙緱${$.farmTask.signInit.signEnergyEachAmount}g\n`);
  }
  // 琚按婊寸牳涓�
  console.log(`琚按婊寸牳涓細 ${$.farmInfo.todayGotWaterGoalTask.canPop ? '鏄�' : '鍚�'}`);
  if ($.farmInfo.todayGotWaterGoalTask.canPop) {
    await gotWaterGoalTaskForFarm();
    if ($.goalResult.code === '0') {
      console.log(`銆愯姘存淮鐮镐腑銆戣幏寰�${$.goalResult.addEnergy}g馃挧\\n`);
      // message += `銆愯姘存淮鐮镐腑銆戣幏寰�${$.goalResult.addEnergy}g馃挧\n`
    }
  }
  console.log(`绛惧埌缁撴潫,寮€濮嬪箍鍛婃祻瑙堜换鍔);
  if (!$.farmTask.gotBrowseTaskAdInit.f) {
    let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
    let browseReward = 0
    let browseSuccess = 0
    let browseFail = 0
    for (let advert of adverts) { //寮€濮嬫祻瑙堝箍鍛�
      if (advert.limit <= advert.hadFinishedTimes) {
        // browseReward+=advert.reward
        console.log(`${advert.mainTitle}+ ' 宸插畬鎴恅);//,鑾峰緱${advert.reward}g
        continue;
      }
      console.log('姝ｅ湪杩涜骞垮憡娴忚浠诲姟: ' + advert.mainTitle);
      await browseAdTaskForFarm(advert.advertId, 0);
      if ($.browseResult.code === '0') {
        console.log(`${advert.mainTitle}娴忚浠诲姟瀹屾垚`);
        //棰嗗彇濂栧姳
        await browseAdTaskForFarm(advert.advertId, 1);
        if ($.browseRwardResult.code === '0') {
          console.log(`棰嗗彇娴忚${advert.mainTitle}骞垮憡濂栧姳鎴愬姛,鑾峰緱${$.browseRwardResult.amount}g`)
          browseReward += $.browseRwardResult.amount
          browseSuccess++
        } else {
          browseFail++
          console.log(`棰嗗彇娴忚骞垮憡濂栧姳缁撴灉:  ${JSON.stringify($.browseRwardResult)}`)
        }
      } else {
        browseFail++
        console.log(`骞垮憡娴忚浠诲姟缁撴灉:   ${JSON.stringify($.browseResult)}`);
      }
    }
    if (browseFail > 0) {
      console.log(`銆愬箍鍛婃祻瑙堛€戝畬鎴�${browseSuccess}涓�,澶辫触${browseFail},鑾峰緱${browseReward}g馃挧\\n`);
      // message += `銆愬箍鍛婃祻瑙堛€戝畬鎴�${browseSuccess}涓�,澶辫触${browseFail},鑾峰緱${browseReward}g馃挧\n`;
    } else {
      console.log(`銆愬箍鍛婃祻瑙堛€戝畬鎴�${browseSuccess}涓�,鑾峰緱${browseReward}g馃挧\n`);
      // message += `銆愬箍鍛婃祻瑙堛€戝畬鎴�${browseSuccess}涓�,鑾峰緱${browseReward}g馃挧\n`;
    }
  } else {
    console.log(`浠婂ぉ宸茬粡鍋氳繃娴忚骞垮憡浠诲姟\n`);
  }
  //瀹氭椂棰嗘按
  if (!$.farmTask.gotThreeMealInit.f) {
    //
    await gotThreeMealForFarm();
    if ($.threeMeal.code === "0") {
      console.log(`銆愬畾鏃堕姘淬€戣幏寰�${$.threeMeal.amount}g馃挧\n`);
      // message += `銆愬畾鏃堕姘淬€戣幏寰�${$.threeMeal.amount}g馃挧\n`;
    } else {
      // message += `銆愬畾鏃堕姘淬€戝け璐�,璇﹁鏃ュ織\n`;
      console.log(`瀹氭椂棰嗘按鎴愬姛缁撴灉:  ${JSON.stringify($.threeMeal)}`);
    }
  } else {
    console.log('褰撳墠涓嶅湪瀹氭椂棰嗘按鏃堕棿鏂垨鑰呭凡缁忛杩嘰n')
  }
  //缁欏ソ鍙嬫祰姘�
  if (!$.farmTask.waterFriendTaskInit.f) {
    if ($.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax) {
      await doFriendsWater();
    }
  } else {
    console.log(`缁�${$.farmTask.waterFriendTaskInit.waterFriendMax}涓ソ鍙嬫祰姘翠换鍔″凡瀹屾垚\n`)
  }
  // await Promise.all([
  //   clockInIn(),//鎵撳崱棰嗘按
  //   executeWaterRains(),//姘存淮闆�
  //   masterHelpShare(),//鍔╁姏濂藉弸
  //   getExtraAward(),//棰嗗彇棰濆姘存淮濂栧姳
  //   turntableFarm()//澶╁ぉ鎶藉寰楀ソ绀�
  // ])
  await getAwardInviteFriend();
  await clockInIn();//鎵撳崱棰嗘按
  await executeWaterRains();//姘存淮闆�
  await getExtraAward();//棰嗗彇棰濆姘存淮濂栧姳
  await turntableFarm()//澶╁ぉ鎶藉寰楀ソ绀�
}
async function predictionFruit() {
  console.log('寮€濮嬮娴嬫按鏋滄垚鐔熸椂闂碶n');
  await initForFarm();
  await taskInitForFarm();
  let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;//浠婂ぉ鍒板埌鐩墠涓烘锛屾祰浜嗗灏戞姘�
  message += `銆愪粖鏃ュ叡娴囨按銆�${waterEveryDayT}娆n`;
  message += `銆愬墿浣� 姘存淮銆�${$.farmInfo.farmUserPro.totalEnergy}g馃挧\n`;
  message += `銆愭按鏋滒煃夎繘搴︺€�${(($.farmInfo.farmUserPro.treeEnergy / $.farmInfo.farmUserPro.treeTotalEnergy) * 100).toFixed(2)}%锛屽凡娴囨按${$.farmInfo.farmUserPro.treeEnergy / 10}娆�,杩橀渶${($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10}娆n`
  if ($.farmInfo.toFlowTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `銆愬紑鑺辫繘搴︺€戝啀娴囨按${$.farmInfo.toFlowTimes - $.farmInfo.farmUserPro.treeEnergy / 10}娆″紑鑺盶n`
  } else if ($.farmInfo.toFruitTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `銆愮粨鏋滆繘搴︺€戝啀娴囨按${$.farmInfo.toFruitTimes - $.farmInfo.farmUserPro.treeEnergy / 10}娆＄粨鏋淺n`
  }
  // 棰勬祴n澶╁悗姘存灉璇惧彲鍏戞崲鍔熻兘
  let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//涓€鍏辫繕闇€娴囧灏戞姘�

  let waterD = Math.ceil(waterTotalT / waterEveryDayT);

  message += `銆愰娴嬨€�${waterD === 1 ? '鏄庡ぉ' : waterD === 2 ? '鍚庡ぉ' : waterD + '澶╀箣鍚�'}(${timeFormat(24 * 60 * 60 * 1000 * waterD + Date.now())}鏃�)鍙厬鎹㈡按鏋滒煃塦
}
//娴囨按鍗佹
async function doTenWater() {
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  await myCardInfoForFarm();
  const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match(`闄愭椂缈诲€峘) && beanCard > 0) {
    console.log(`鎮ㄨ缃殑鏄娇鐢ㄦ按婊存崲璞嗗崱锛屼笖鑳屽寘鏈夋按婊存崲璞嗗崱${beanCard}寮�, 璺宠繃10娆℃祰姘翠换鍔)
    return
  }
  if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    console.log(`\n鍑嗗娴囨按鍗佹`);
    let waterCount = 0;
    isFruitFinished = false;
    for (; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
      console.log(`绗�${waterCount + 1}娆℃祰姘碻);
      await waterGoodForFarm();
      console.log(`鏈娴囨按缁撴灉:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`鍓╀綑姘存淮${$.waterResult.totalEnergy}g`);
        if ($.waterResult.finished) {
          // 宸茶瘉瀹烇紝waterResult.finished涓簍rue锛岃〃绀烘按鏋滃彲浠ュ幓棰嗗彇鍏戞崲浜�
          isFruitFinished = true;
          break
        } else {
          if ($.waterResult.totalEnergy < 10) {
            console.log(`姘存淮涓嶅锛岀粨鏉熸祰姘碻)
            break
          }
          await gotStageAward();//棰嗗彇闃舵鎬ф按婊村鍔�
        }
      } else {
        console.log('娴囨按鍑虹幇澶辫触寮傚父,璺冲嚭涓嶅湪缁х画娴囨按')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `銆愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n銆愭彁閱掆彴銆�${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭鏌ョ湅\n鐐瑰嚮寮圭獥鍗宠揪`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 璐﹀彿${$.index} - ${$.nickName || $.UserName}姘存灉宸插彲棰嗗彇`, `浜笢璐﹀彿${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇`);
      }
    }
  } else {
    console.log('\n浠婃棩宸插畬鎴�10娆℃祰姘翠换鍔n');
  }
}
//棰嗗彇棣栨娴囨按濂栧姳
async function getFirstWaterAward() {
  await taskInitForFarm();
  //棰嗗彇棣栨娴囨按濂栧姳
  if (!$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0) {
    await firstWaterTaskForFarm();
    if ($.firstWaterReward.code === '0') {
      console.log(`銆愰娆℃祰姘村鍔便€戣幏寰�${$.firstWaterReward.amount}g馃挧\n`);
      // message += `銆愰娆℃祰姘村鍔便€戣幏寰�${$.firstWaterReward.amount}g馃挧\n`;
    } else {
      // message += '銆愰娆℃祰姘村鍔便€戦鍙栧鍔卞け璐�,璇﹁鏃ュ織\n';
      console.log(`棰嗗彇棣栨娴囨按濂栧姳缁撴灉:  ${JSON.stringify($.firstWaterReward)}`);
    }
  } else {
    console.log('棣栨娴囨按濂栧姳宸查鍙朶n')
  }
}
//棰嗗彇鍗佹娴囨按濂栧姳
async function getTenWaterAward() {
  //棰嗗彇10娆℃祰姘村鍔�
  if (!$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    await totalWaterTaskForFarm();
    if ($.totalWaterReward.code === '0') {
      console.log(`銆愬崄娆℃祰姘村鍔便€戣幏寰�${$.totalWaterReward.totalWaterTaskEnergy}g馃挧\n`);
      // message += `銆愬崄娆℃祰姘村鍔便€戣幏寰�${$.totalWaterReward.totalWaterTaskEnergy}g馃挧\n`;
    } else {
      // message += '銆愬崄娆℃祰姘村鍔便€戦鍙栧鍔卞け璐�,璇﹁鏃ュ織\n';
      console.log(`棰嗗彇10娆℃祰姘村鍔辩粨鏋�:  ${JSON.stringify($.totalWaterReward)}`);
    }
  } else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    // message += `銆愬崄娆℃祰姘村鍔便€戜换鍔℃湭瀹屾垚锛屼粖鏃ユ祰姘�${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}娆n`;
    console.log(`銆愬崄娆℃祰姘村鍔便€戜换鍔℃湭瀹屾垚锛屼粖鏃ユ祰姘�${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}娆n`);
  }
  console.log('finished 姘存灉浠诲姟瀹屾垚!');
}
//鍐嶆娴囨按
async function doTenWaterAgain() {
  console.log('寮€濮嬫鏌ュ墿浣欐按婊磋兘鍚﹀啀娆℃祰姘村啀娆℃祰姘碶n');
  await initForFarm();
  let totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
  console.log(`鍓╀綑姘存淮${totalEnergy}g\n`);
  await myCardInfoForFarm();
  const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
  console.log(`鑳屽寘宸叉湁閬撳叿:\n蹇€熸祰姘村崱:${fastCard === -1 ? '鏈В閿�': fastCard + '寮�'}\n姘存淮缈诲€嶅崱:${doubleCard === -1 ? '鏈В閿�': doubleCard + '寮�'}\n姘存淮鎹含璞嗗崱:${beanCard === -1 ? '鏈В閿�' : beanCard + '寮�'}\n鍔犵鍗�:${signCard === -1 ? '鏈В閿�' : signCard + '寮�'}\n`)
  if (totalEnergy >= 100 && doubleCard > 0) {
    //浣跨敤缈诲€嶆按婊村崱
    for (let i = 0; i < new Array(doubleCard).fill('').length; i++) {
      await userMyCardForFarm('doubleCard');
      console.log(`浣跨敤缈诲€嶆按婊村崱缁撴灉:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  if (signCard > 0) {
    //浣跨敤鍔犵鍗�
    for (let i = 0; i < new Array(signCard).fill('').length; i++) {
      await userMyCardForFarm('signCard');
      console.log(`浣跨敤鍔犵鍗＄粨鏋�:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match('闄愭椂缈诲€�')) {
    console.log(`\n鎮ㄨ缃殑鏄按婊存崲璞嗗姛鑳�,鐜板湪涓烘偍鎹㈣眴`);
    if (totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
      //浣跨敤姘存淮鎹㈣眴鍗�
      await userMyCardForFarm('beanCard');
      console.log(`浣跨敤姘存淮鎹㈣眴鍗＄粨鏋�:${JSON.stringify($.userMyCardRes)}`);
      if ($.userMyCardRes.code === '0') {
        message += `銆愭按婊存崲璞嗗崱銆戣幏寰�${$.userMyCardRes.beanCount}涓含璞哱n`;
        return
      }
    } else {
      console.log(`鎮ㄧ洰鍓嶆按婊�:${totalEnergy}g,姘存淮鎹㈣眴鍗�${$.myCardInfoRes.beanCard}寮�,鏆備笉婊¤冻姘存淮鎹㈣眴鐨勬潯浠�,涓烘偍缁х画娴囨按`)
    }
  }
  // if (totalEnergy > 100 && $.myCardInfoRes.fastCard > 0) {
  //   //浣跨敤蹇€熸祰姘村崱
  //   await userMyCardForFarm('fastCard');
  //   console.log(`浣跨敤蹇€熸祰姘村崱缁撴灉:${JSON.stringify($.userMyCardRes)}`);
  //   if ($.userMyCardRes.code === '0') {
  //     console.log(`宸蹭娇鐢ㄥ揩閫熸祰姘村崱娴囨按${$.userMyCardRes.waterEnergy}g`);
  //   }
  //   await initForFarm();
  //   totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
  // }
  // 鎵€鏈夌殑娴囨按(10娆℃祰姘�)浠诲姟锛岃幏鍙栨按婊翠换鍔″畬鎴愬悗锛屽鏋滃墿浣欐按婊村ぇ浜庣瓑浜�60g,鍒欑户缁祰姘�(淇濈暀閮ㄥ垎姘存淮鏄敤浜庡畬鎴愮浜屽ぉ鐨勬祰姘�10娆＄殑浠诲姟)
  let overageEnergy = totalEnergy - retainWater;
  if (totalEnergy >= ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy)) {
    //濡傛灉鐜版湁鐨勬按婊达紝澶т簬姘存灉鍙厬鎹㈡墍闇€鐨勫婊�(涔熷氨鏄妸姘存淮娴囧畬锛屾按鏋滃氨鑳藉厬鎹簡)
    isFruitFinished = false;
    for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
      await waterGoodForFarm();
      console.log(`鏈娴囨按缁撴灉(姘存灉椹笂灏卞彲鍏戞崲浜�):   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log('\n娴囨按10g鎴愬姛\n');
        if ($.waterResult.finished) {
          // 宸茶瘉瀹烇紝waterResult.finished涓簍rue锛岃〃绀烘按鏋滃彲浠ュ幓棰嗗彇鍏戞崲浜�
          isFruitFinished = true;
          break
        } else {
          console.log(`鐩墠姘存淮銆�${$.waterResult.totalEnergy}銆慻,缁х画娴囨按锛屾按鏋滈┈涓婂氨鍙互鍏戞崲浜哷)
        }
      } else {
        console.log('娴囨按鍑虹幇澶辫触寮傚父,璺冲嚭涓嶅湪缁х画娴囨按')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `銆愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n銆愭彁閱掆彴銆�${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭鏌ョ湅\n鐐瑰嚮寮圭獥鍗宠揪`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 璐﹀彿${$.index} - ${$.nickName}姘存灉宸插彲棰嗗彇`, `浜笢璐﹀彿${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇`);
      }
    }
  } else if (overageEnergy >= 10) {
    console.log("鐩墠鍓╀綑姘存淮锛氥€�" + totalEnergy + "銆慻锛屽彲缁х画娴囨按");
    isFruitFinished = false;
    for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
      await waterGoodForFarm();
      console.log(`鏈娴囨按缁撴灉:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`\n娴囨按10g鎴愬姛,鍓╀綑${$.waterResult.totalEnergy}\n`)
        if ($.waterResult.finished) {
          // 宸茶瘉瀹烇紝waterResult.finished涓簍rue锛岃〃绀烘按鏋滃彲浠ュ幓棰嗗彇鍏戞崲浜�
          isFruitFinished = true;
          break
        } else {
          await gotStageAward()
        }
      } else {
        console.log('娴囨按鍑虹幇澶辫触寮傚父,璺冲嚭涓嶅湪缁х画娴囨按')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `銆愪含涓滆处鍙�${$.index}銆�${$.nickName || $.UserName}\n銆愭彁閱掆彴銆�${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇\n璇峰幓浜笢APP鎴栧井淇″皬绋嬪簭鏌ョ湅\n鐐瑰嚮寮圭獥鍗宠揪`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 璐﹀彿${$.index} - ${$.nickName}姘存灉宸插彲棰嗗彇`, `浜笢璐﹀彿${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}宸插彲棰嗗彇`);
      }
    }
  } else {
    console.log("鐩墠鍓╀綑姘存淮锛氥€�" + totalEnergy + "銆慻,涓嶅啀缁х画娴囨按,淇濈暀閮ㄥ垎姘存淮鐢ㄤ簬瀹屾垚绗簩澶┿€愬崄娆℃祰姘村緱姘存淮銆戜换鍔�")
  }
}
//棰嗗彇闃舵鎬ф按婊村鍔�
function gotStageAward() {
  return new Promise(async resolve => {
    if ($.waterResult.waterStatus === 0 && $.waterResult.treeEnergy === 10) {
      console.log('鏋滄爲鍙戣娊浜�,濂栧姳30g姘存淮');
      await gotStageAwardForFarm('1');
      console.log(`娴囨按闃舵濂栧姳1棰嗗彇缁撴灉 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `銆愭灉鏍戝彂鑺戒簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}\n`;
        console.log(`銆愭灉鏍戝彂鑺戒簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}\n`);
      }
    } else if ($.waterResult.waterStatus === 1) {
      console.log('鏋滄爲寮€鑺变簡,濂栧姳40g姘存淮');
      await gotStageAwardForFarm('2');
      console.log(`娴囨按闃舵濂栧姳2棰嗗彇缁撴灉 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `銆愭灉鏍戝紑鑺变簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}g馃挧\n`;
        console.log(`銆愭灉鏍戝紑鑺变簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}g馃挧\n`);
      }
    } else if ($.waterResult.waterStatus === 2) {
      console.log('鏋滄爲闀垮嚭灏忔灉瀛愬暒, 濂栧姳50g姘存淮');
      await gotStageAwardForFarm('3');
      console.log(`娴囨按闃舵濂栧姳3棰嗗彇缁撴灉 ${JSON.stringify($.gotStageAwardForFarmRes)}`)
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `銆愭灉鏍戠粨鏋滀簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}g馃挧\n`;
        console.log(`銆愭灉鏍戠粨鏋滀簡銆戝鍔�${$.gotStageAwardForFarmRes.addEnergy}g馃挧\n`);
      }
    }
    resolve()
  })
}
//澶╁ぉ鎶藉娲诲姩
async function turntableFarm() {
  await initForTurntableFarm();
  if ($.initForTurntableFarmRes.code === '0') {
    //棰嗗彇瀹氭椂濂栧姳 //4灏忔椂涓€娆�
    let {timingIntervalHours, timingLastSysTime, sysTime, timingGotStatus, remainLotteryTimes, turntableInfos} = $.initForTurntableFarmRes;

    if (!timingGotStatus) {
      console.log(`鏄惁鍒颁簡棰嗗彇鍏嶈垂璧犻€佺殑鎶藉鏈轰細----${sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)}`)
      if (sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)) {
        await timingAwardForTurntableFarm();
        console.log(`棰嗗彇瀹氭椂濂栧姳缁撴灉${JSON.stringify($.timingAwardRes)}`);
        await initForTurntableFarm();
        remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
      } else {
        console.log(`鍏嶈垂璧犻€佺殑鎶藉鏈轰細鏈埌鏃堕棿`)
      }
    } else {
      console.log('4灏忔椂鍊欏厤璐硅禒閫佺殑鎶藉鏈轰細宸查鍙�')
    }
    if ($.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0) {
      for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) {
        if (!$.initForTurntableFarmRes.turntableBrowserAds[index].status) {
          console.log(`寮€濮嬫祻瑙堝ぉ澶╂娊濂栫殑绗�${index + 1}涓€涗細鍦轰换鍔)
          await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
          if ($.browserForTurntableFarmRes.code === '0' && $.browserForTurntableFarmRes.status) {
            console.log(`绗�${index + 1}涓€涗細鍦轰换鍔″畬鎴愶紝寮€濮嬮鍙栨按婊村鍔盶n`)
            await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
            if ($.browserForTurntableFarmRes.code === '0') {
              console.log(`绗�${index + 1}涓€涗細鍦轰换鍔￠鍙栨按婊村鍔卞畬鎴怽n`)
              await initForTurntableFarm();
              remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
            }
          }
        } else {
          console.log(`娴忚澶╁ぉ鎶藉鐨勭${index + 1}涓€涗細鍦轰换鍔″凡瀹屾垚`)
        }
      }
    }
    //澶╁ぉ鎶藉鍔╁姏
    console.log('寮€濮嬪ぉ澶╂娊濂�--濂藉弸鍔╁姏--姣忎汉姣忓ぉ鍙湁涓夋鍔╁姏鏈轰細.')
    for (let code of newShareCodes) {
      if (code === $.farmInfo.farmUserPro.shareCode) {
        console.log('澶╁ぉ鎶藉-涓嶈兘鑷繁缁欒嚜宸卞姪鍔沑n')
        continue
      }
      await lotteryMasterHelp(code);
      // console.log('澶╁ぉ鎶藉鍔╁姏缁撴灉',lotteryMasterHelpRes.helpResult)
      if ($.lotteryMasterHelpRes.helpResult.code === '0') {
        console.log(`澶╁ぉ鎶藉-鍔╁姏${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}鎴愬姛\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '11') {
        console.log(`澶╁ぉ鎶藉-涓嶈閲嶅鍔╁姏${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '13') {
        console.log(`澶╁ぉ鎶藉-鍔╁姏${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}澶辫触,鍔╁姏娆℃暟鑰楀敖\n`);
        break;
      }
    }
    console.log(`---澶╁ぉ鎶藉娆℃暟remainLotteryTimes----${remainLotteryTimes}娆)
    //鎶藉
    if (remainLotteryTimes > 0) {
      console.log('寮€濮嬫娊濂�')
      let lotteryResult = '';
      for (let i = 0; i < new Array(remainLotteryTimes).fill('').length; i++) {
        await lotteryForTurntableFarm()
        console.log(`绗�${i + 1}娆℃娊濂栫粨鏋�${JSON.stringify($.lotteryRes)}`);
        if ($.lotteryRes.code === '0') {
          turntableInfos.map((item) => {
            if (item.type === $.lotteryRes.type) {
              console.log(`lotteryRes.type${$.lotteryRes.type}`);
              if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === 'bean') {
                lotteryResult += `${item.name}涓紝`;
              } else if ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === 'water') {
                lotteryResult += `${item.name}锛宍;
              } else {
                lotteryResult += `${item.name}锛宍;
              }
            }
          })
          //娌℃湁娆℃暟浜�
          if ($.lotteryRes.remainLotteryTimes === 0) {
            break
          }
        }
      }
      if (lotteryResult) {
        console.log(`銆愬ぉ澶╂娊濂栥€�${lotteryResult.substr(0, lotteryResult.length - 1)}\n`)
        // message += `銆愬ぉ澶╂娊濂栥€�${lotteryResult.substr(0, lotteryResult.length - 1)}\n`;
      }
    }  else {
      console.log('澶╁ぉ鎶藉--鎶藉鏈轰細涓�0娆�')
    }
  } else {
    console.log('鍒濆鍖栧ぉ澶╂娊濂栧緱濂界ぜ澶辫触')
  }
}
//棰嗗彇棰濆濂栧姳姘存淮
async function getExtraAward() {
  await masterHelpTaskInitForFarm();
  if ($.masterHelpResult.code === '0') {
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5) {
      // 宸叉湁浜斾汉鍔╁姏銆傞鍙栧姪鍔涘悗鐨勫鍔�
      if (!$.masterHelpResult.masterGotFinal) {
        await masterGotFinishedTaskForFarm();
        if ($.masterGotFinished.code === '0') {
          console.log(`宸叉垚鍔熼鍙栧ソ鍙嬪姪鍔涘鍔憋細銆�${$.masterGotFinished.amount}銆慻姘碻);
          message += `銆愰澶栧鍔便€�${$.masterGotFinished.amount}g姘撮鍙栨垚鍔焅n`;
        }
      } else {
        console.log("宸茬粡棰嗗彇杩�5濂藉弸鍔╁姏棰濆濂栧姳");
        message += `銆愰澶栧鍔便€戝凡琚鍙栬繃\n`;
      }
    } else {
      console.log("鍔╁姏濂藉弸鏈揪鍒�5涓�");
      message += `銆愰澶栧鍔便€戦鍙栧け璐�,鍘熷洜锛氱粰鎮ㄥ姪鍔涚殑浜烘湭杈�5涓猏n`;
    }
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
      let str = '';
      $.masterHelpResult.masterHelpPeoples.map((item, index) => {
        if (index === ($.masterHelpResult.masterHelpPeoples.length - 1)) {
          str += item.nickName || "鍖垮悕鐢ㄦ埛";
        } else {
          str += (item.nickName || "鍖垮悕鐢ㄦ埛") + ',';
        }
        let date = new Date(item.time);
        let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
        console.log(`\n浜笢鏄电О銆�${item.nickName || "鍖垮悕鐢ㄦ埛"}銆� 鍦� ${time} 缁欐偍鍔╄繃鍔沑n`);
      })
      message += `銆愬姪鍔涙偍鐨勫ソ鍙嬨€�${str}\n`;
    }
    console.log('棰嗗彇棰濆濂栧姳姘存淮缁撴潫\n');
  }
}
//鍔╁姏濂藉弸
async function masterHelpShare() {
  console.log('寮€濮嬪姪鍔涘ソ鍙�')
  let salveHelpAddWater = 0;
  let remainTimes = 3;//浠婃棩鍓╀綑鍔╁姏娆℃暟,榛樿3娆★紙浜笢鍐滃満姣忎汉姣忓ぉ3娆″姪鍔涙満浼氾級銆�
  let helpSuccessPeoples = '';//鎴愬姛鍔╁姏濂藉弸
  console.log(`鏍煎紡鍖栧悗鐨勫姪鍔涚爜::${JSON.stringify(newShareCodes)}\n`);

  for (let code of newShareCodes) {
    console.log(`寮€濮嬪姪鍔涗含涓滆处鍙�${$.index} - ${$.nickName}鐨勫ソ鍙�: ${code}`);
    if (!code) continue;
    if (code === $.farmInfo.farmUserPro.shareCode) {
      console.log('涓嶈兘涓鸿嚜宸卞姪鍔涘摝锛岃烦杩囪嚜宸辩殑shareCode\n')
      continue
    }
    await masterHelp(code);
    if ($.helpResult.code === '0') {
      if ($.helpResult.helpResult.code === '0') {
        //鍔╁姏鎴愬姛
        salveHelpAddWater += $.helpResult.helpResult.salveHelpAddWater;
        console.log(`銆愬姪鍔涘ソ鍙嬬粨鏋溿€�: 宸叉垚鍔熺粰銆�${$.helpResult.helpResult.masterUserInfo.nickName}銆戝姪鍔沗);
        console.log(`缁欏ソ鍙嬨€�${$.helpResult.helpResult.masterUserInfo.nickName}銆戝姪鍔涜幏寰�${$.helpResult.helpResult.salveHelpAddWater}g姘存淮`)
        helpSuccessPeoples += ($.helpResult.helpResult.masterUserInfo.nickName || '鍖垮悕鐢ㄦ埛') + ',';
      } else if ($.helpResult.helpResult.code === '8') {
        console.log(`銆愬姪鍔涘ソ鍙嬬粨鏋溿€�: 鍔╁姏銆�${$.helpResult.helpResult.masterUserInfo.nickName}銆戝け璐ワ紝鎮ㄤ粖澶╁姪鍔涙鏁板凡鑰楀敖`);
      } else if ($.helpResult.helpResult.code === '9') {
        console.log(`銆愬姪鍔涘ソ鍙嬬粨鏋溿€�: 涔嬪墠缁欍€�${$.helpResult.helpResult.masterUserInfo.nickName}銆戝姪鍔涜繃浜哷);
      } else if ($.helpResult.helpResult.code === '10') {
        console.log(`銆愬姪鍔涘ソ鍙嬬粨鏋溿€�: 濂藉弸銆�${$.helpResult.helpResult.masterUserInfo.nickName}銆戝凡婊′簲浜哄姪鍔沗);
      } else {
        console.log(`鍔╁姏鍏朵粬鎯呭喌锛�${JSON.stringify($.helpResult.helpResult)}`);
      }
      console.log(`銆愪粖鏃ュ姪鍔涙鏁拌繕鍓┿€�${$.helpResult.helpResult.remainTimes}娆n`);
      remainTimes = $.helpResult.helpResult.remainTimes;
      if ($.helpResult.helpResult.remainTimes === 0) {
        console.log(`鎮ㄥ綋鍓嶅姪鍔涙鏁板凡鑰楀敖锛岃烦鍑哄姪鍔沗);
        break
      }
    } else {
      console.log(`鍔╁姏澶辫触::${JSON.stringify($.helpResult)}`);
    }
  }
  if ($.isLoon() || $.isQuanX() || $.isSurge()) {
    let helpSuccessPeoplesKey = timeFormat() + $.farmInfo.farmUserPro.shareCode;
    if (!$.getdata(helpSuccessPeoplesKey)) {
      //鎶婂墠涓€澶╃殑娓呴櫎
      $.setdata('', timeFormat(Date.now() - 24 * 60 * 60 * 1000) + $.farmInfo.farmUserPro.shareCode);
      $.setdata('', helpSuccessPeoplesKey);
    }
    if (helpSuccessPeoples) {
      if ($.getdata(helpSuccessPeoplesKey)) {
        $.setdata($.getdata(helpSuccessPeoplesKey) + ',' + helpSuccessPeoples, helpSuccessPeoplesKey);
      } else {
        $.setdata(helpSuccessPeoples, helpSuccessPeoplesKey);
      }
    }
    helpSuccessPeoples = $.getdata(helpSuccessPeoplesKey);
  }
  if (helpSuccessPeoples && helpSuccessPeoples.length > 0) {
    message += `銆愭偍鍔╁姏鐨勫ソ鍙嬸煈€�${helpSuccessPeoples.substr(0, helpSuccessPeoples.length - 1)}\n`;
  }
  if (salveHelpAddWater > 0) {
    // message += `銆愬姪鍔涘ソ鍙嬸煈€戣幏寰�${salveHelpAddWater}g馃挧\n`;
    console.log(`銆愬姪鍔涘ソ鍙嬸煈€戣幏寰�${salveHelpAddWater}g馃挧\n`);
  }
  message += `銆愪粖鏃ュ墿浣欏姪鍔涴煈€�${remainTimes}娆n`;
  console.log('鍔╁姏濂藉弸缁撴潫锛屽嵆灏嗗紑濮嬮鍙栭澶栨按婊村鍔盶n');
}
//姘存淮闆�
async function executeWaterRains() {
  let executeWaterRain = !$.farmTask.waterRainInit.f;
  if (executeWaterRain) {
    console.log(`姘存淮闆ㄤ换鍔★紝姣忓ぉ涓ゆ锛屾渶澶氬彲寰�10g姘存淮`);
    console.log(`涓ゆ姘存淮闆ㄤ换鍔℃槸鍚﹀叏閮ㄥ畬鎴愶細${$.farmTask.waterRainInit.f ? '鏄�' : '鍚�'}`);
    if ($.farmTask.waterRainInit.lastTime) {
      if (Date.now() < ($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000)) {
        executeWaterRain = false;
        // message += `銆愮${$.farmTask.waterRainInit.winTimes + 1}娆℃按婊撮洦銆戞湭鍒版椂闂达紝璇�${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}鍐嶈瘯\n`;
        console.log(`\`銆愮${$.farmTask.waterRainInit.winTimes + 1}娆℃按婊撮洦銆戞湭鍒版椂闂达紝璇�${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}鍐嶈瘯\n`);
      }
    }
    if (executeWaterRain) {
      console.log(`寮€濮嬫按婊撮洦浠诲姟,杩欐槸绗�${$.farmTask.waterRainInit.winTimes + 1}娆★紝鍓╀綑${2 - ($.farmTask.waterRainInit.winTimes + 1)}娆);
      await waterRainForFarm();
      console.log('姘存淮闆╳aterRain');
      if ($.waterRain.code === '0') {
        console.log('姘存淮闆ㄤ换鍔℃墽琛屾垚鍔燂紝鑾峰緱姘存淮锛�' + $.waterRain.addEnergy + 'g');
        console.log(`銆愮${$.farmTask.waterRainInit.winTimes + 1}娆℃按婊撮洦銆戣幏寰�${$.waterRain.addEnergy}g姘存淮\n`);
        // message += `銆愮${$.farmTask.waterRainInit.winTimes + 1}娆℃按婊撮洦銆戣幏寰�${$.waterRain.addEnergy}g姘存淮\n`;
      }
    }
  } else {
    // message += `銆愭按婊撮洦銆戝凡鍏ㄩ儴瀹屾垚锛岃幏寰�20g馃挧\n`;
  }
}
//鎵撳崱棰嗘按娲诲姩
async function clockInIn() {
  console.log('寮€濮嬫墦鍗￠姘存椿鍔紙绛惧埌锛屽叧娉紝棰嗗埜锛�');
  await clockInInitForFarm();
  if ($.clockInInit.code === '0') {
    // 绛惧埌寰楁按婊�
    if (!$.clockInInit.todaySigned) {
      console.log('寮€濮嬩粖鏃ョ鍒�');
      await clockInForFarm();
      console.log(`鎵撳崱缁撴灉${JSON.stringify($.clockInForFarmRes)}`);
      if ($.clockInForFarmRes.code === '0') {
        // message += `銆愮${$.clockInForFarmRes.signDay}澶╃鍒般€戣幏寰�${$.clockInForFarmRes.amount}g馃挧\n`;
        console.log(`銆愮${$.clockInForFarmRes.signDay}澶╃鍒般€戣幏寰�${$.clockInForFarmRes.amount}g馃挧\n`)
        if ($.clockInForFarmRes.signDay === 7) {
          //鍙互棰嗗彇鎯婂枩绀煎寘
          console.log('寮€濮嬮鍙�--鎯婂枩绀煎寘38g姘存淮');
          await gotClockInGift();
          if ($.gotClockInGiftRes.code === '0') {
            // message += `銆愭儕鍠滅ぜ鍖呫€戣幏寰�${$.gotClockInGiftRes.amount}g馃挧\n`;
            console.log(`銆愭儕鍠滅ぜ鍖呫€戣幏寰�${$.gotClockInGiftRes.amount}g馃挧\n`);
          }
        }
      }
    }
    if ($.clockInInit.todaySigned && $.clockInInit.totalSigned === 7) {
      console.log('寮€濮嬮鍙�--鎯婂枩绀煎寘38g姘存淮');
      await gotClockInGift();
      if ($.gotClockInGiftRes.code === '0') {
        // message += `銆愭儕鍠滅ぜ鍖呫€戣幏寰�${$.gotClockInGiftRes.amount}g馃挧\n`;
        console.log(`銆愭儕鍠滅ぜ鍖呫€戣幏寰�${$.gotClockInGiftRes.amount}g馃挧\n`);
      }
    }
    // 闄愭椂鍏虫敞寰楁按婊�
    if ($.clockInInit.themes && $.clockInInit.themes.length > 0) {
      for (let item of $.clockInInit.themes) {
        if (!item.hadGot) {
          console.log(`鍏虫敞ID${item.id}`);
          await clockInFollowForFarm(item.id, "theme", "1");
          console.log(`themeStep1--缁撴灉${JSON.stringify($.themeStep1)}`);
          if ($.themeStep1.code === '0') {
            await clockInFollowForFarm(item.id, "theme", "2");
            console.log(`themeStep2--缁撴灉${JSON.stringify($.themeStep2)}`);
            if ($.themeStep2.code === '0') {
              console.log(`鍏虫敞${item.name}锛岃幏寰楁按婊�${$.themeStep2.amount}g`);
            }
          }
        }
      }
    }
    // 闄愭椂棰嗗埜寰楁按婊�
    if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0) {
      for (let item of $.clockInInit.venderCoupons) {
        if (!item.hadGot) {
          console.log(`棰嗗埜鐨処D${item.id}`);
          await clockInFollowForFarm(item.id, "venderCoupon", "1");
          console.log(`venderCouponStep1--缁撴灉${JSON.stringify($.venderCouponStep1)}`);
          if ($.venderCouponStep1.code === '0') {
            await clockInFollowForFarm(item.id, "venderCoupon", "2");
            if ($.venderCouponStep2.code === '0') {
              console.log(`venderCouponStep2--缁撴灉${JSON.stringify($.venderCouponStep2)}`);
              console.log(`浠�${item.name}棰嗗埜锛岃幏寰楁按婊�${$.venderCouponStep2.amount}g`);
            }
          }
        }
      }
    }
  }
  console.log('寮€濮嬫墦鍗￠姘存椿鍔紙绛惧埌锛屽叧娉紝棰嗗埜锛夌粨鏉焅n');
}
//
async function getAwardInviteFriend() {
  await friendListInitForFarm();//鏌ヨ濂藉弸鍒楄〃
  // console.log(`鏌ヨ濂藉弸鍒楄〃鏁版嵁锛�${JSON.stringify($.friendList)}\n`)
  if ($.friendList) {
    console.log(`\n浠婃棩宸查個璇峰ソ鍙�${$.friendList.inviteFriendCount}涓� / 姣忔棩閭€璇蜂笂闄�${$.friendList.inviteFriendMax}涓猔);
    console.log(`寮€濮嬪垹闄�${$.friendList.friends && $.friendList.friends.length}涓ソ鍙�,鍙嬁姣忓ぉ鐨勯個璇峰鍔盽);
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      for (let friend of $.friendList.friends) {
        console.log(`\n寮€濮嬪垹闄ゅソ鍙� [${friend.shareCode}]`);
        const deleteFriendForFarm = await request('deleteFriendForFarm', { "shareCode": `${friend.shareCode}`,"version":8,"channel":1 });
        if (deleteFriendForFarm && deleteFriendForFarm.code === '0') {
          console.log(`鍒犻櫎濂藉弸 [${friend.shareCode}] 鎴愬姛\n`);
        }
      }
    }
    await receiveFriendInvite();//涓轰粬浜哄姪鍔�,鎺ュ彈閭€璇锋垚涓哄埆浜虹殑濂藉弸
    if ($.friendList.inviteFriendCount > 0) {
      if ($.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount) {
        console.log('寮€濮嬮鍙栭個璇峰ソ鍙嬬殑濂栧姳');
        await awardInviteFriendForFarm();
        console.log(`棰嗗彇閭€璇峰ソ鍙嬬殑濂栧姳缁撴灉锛氾細${JSON.stringify($.awardInviteFriendRes)}`);
      }
    } else {
      console.log('浠婃棩鏈個璇疯繃濂藉弸')
    }
  } else {
    console.log(`鏌ヨ濂藉弸鍒楄〃澶辫触\n`);
  }
}
//缁欏ソ鍙嬫祰姘�
async function doFriendsWater() {
  await friendListInitForFarm();
  console.log('寮€濮嬬粰濂藉弸娴囨按...');
  await taskInitForFarm();
  const { waterFriendCountKey, waterFriendMax } = $.farmTask.waterFriendTaskInit;
  console.log(`浠婃棩宸茬粰${waterFriendCountKey}涓ソ鍙嬫祰姘碻);
  if (waterFriendCountKey < waterFriendMax) {
    let needWaterFriends = [];
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      $.friendList.friends.map((item, index) => {
        if (item.friendState === 1) {
          if (needWaterFriends.length < (waterFriendMax - waterFriendCountKey)) {
            needWaterFriends.push(item.shareCode);
          }
        }
      });
      console.log(`闇€瑕佹祰姘寸殑濂藉弸鍒楄〃shareCodes:${JSON.stringify(needWaterFriends)}`);
      let waterFriendsCount = 0, cardInfoStr = '';
      for (let index = 0; index < needWaterFriends.length; index ++) {
        await waterFriendForFarm(needWaterFriends[index]);
        console.log(`涓虹${index+1}涓ソ鍙嬫祰姘寸粨鏋�:${JSON.stringify($.waterFriendForFarmRes)}\n`)
        if ($.waterFriendForFarmRes.code === '0') {
          waterFriendsCount ++;
          if ($.waterFriendForFarmRes.cardInfo) {
            console.log('涓哄ソ鍙嬫祰姘磋幏寰楅亾鍏蜂簡');
            if ($.waterFriendForFarmRes.cardInfo.type === 'beanCard') {
              console.log(`鑾峰彇閬撳叿鍗�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `姘存淮鎹㈣眴鍗�,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'fastCard') {
              console.log(`鑾峰彇閬撳叿鍗�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `蹇€熸祰姘村崱,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'doubleCard') {
              console.log(`鑾峰彇閬撳叿鍗�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `姘存淮缈诲€嶅崱,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'signCard') {
              console.log(`鑾峰彇閬撳叿鍗�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `鍔犵鍗�,`;
            }
          }
        } else if ($.waterFriendForFarmRes.code === '11') {
          console.log('姘存淮涓嶅,璺冲嚭娴囨按')
        }
      }
      // message += `銆愬ソ鍙嬫祰姘淬€戝凡缁�${waterFriendsCount}涓ソ鍙嬫祰姘�,娑堣€�${waterFriendsCount * 10}g姘碶n`;
      console.log(`銆愬ソ鍙嬫祰姘淬€戝凡缁�${waterFriendsCount}涓ソ鍙嬫祰姘�,娑堣€�${waterFriendsCount * 10}g姘碶n`);
      if (cardInfoStr && cardInfoStr.length > 0) {
        // message += `銆愬ソ鍙嬫祰姘村鍔便€�${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`;
        console.log(`銆愬ソ鍙嬫祰姘村鍔便€�${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`);
      }
    } else {
      console.log('鎮ㄧ殑濂藉弸鍒楄〃鏆傛棤濂藉弸,蹇幓閭€璇锋偍鐨勫ソ鍙嬪惂!')
    }
  } else {
    console.log(`浠婃棩宸蹭负濂藉弸娴囨按閲忓凡杈�${waterFriendMax}涓猔)
  }
}
//棰嗗彇缁�3涓ソ鍙嬫祰姘村悗鐨勫鍔辨按婊�
async function getWaterFriendGotAward() {
  await taskInitForFarm();
  const { waterFriendCountKey, waterFriendMax, waterFriendSendWater, waterFriendGotAward } = $.farmTask.waterFriendTaskInit
  if (waterFriendCountKey >= waterFriendMax) {
    if (!waterFriendGotAward) {
      await waterFriendGotAwardForFarm();
      console.log(`棰嗗彇缁�${waterFriendMax}涓ソ鍙嬫祰姘村悗鐨勫鍔辨按婊�::${JSON.stringify($.waterFriendGotAwardRes)}`)
      if ($.waterFriendGotAwardRes.code === '0') {
        // message += `銆愮粰${waterFriendMax}濂藉弸娴囨按銆戝鍔�${$.waterFriendGotAwardRes.addWater}g姘存淮\n`;
        console.log(`銆愮粰${waterFriendMax}濂藉弸娴囨按銆戝鍔�${$.waterFriendGotAwardRes.addWater}g姘存淮\n`);
      }
    } else {
      console.log(`缁欏ソ鍙嬫祰姘寸殑${waterFriendSendWater}g姘存淮濂栧姳宸查鍙朶n`);
      // message += `銆愮粰${waterFriendMax}濂藉弸娴囨按銆戝鍔�${waterFriendSendWater}g姘存淮宸查鍙朶n`;
    }
  } else {
    console.log(`鏆傛湭缁�${waterFriendMax}涓ソ鍙嬫祰姘碶n`);
  }
}
//鎺ユ敹鎴愪负瀵规柟濂藉弸鐨勯個璇�
async function receiveFriendInvite() {
  for (let code of newShareCodes) {
    if (code === $.farmInfo.farmUserPro.shareCode) {
      console.log('鑷繁涓嶈兘閭€璇疯嚜宸辨垚涓哄ソ鍙嬪櫌\n')
      continue
    }
    await inviteFriend(code);
    // console.log(`鎺ユ敹閭€璇锋垚涓哄ソ鍙嬬粨鏋�:${JSON.stringify($.inviteFriendRes)}`)
    if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '0') {
      console.log(`鎺ユ敹閭€璇锋垚涓哄ソ鍙嬬粨鏋滄垚鍔�,鎮ㄥ凡鎴愪负${$.inviteFriendRes.helpResult.masterUserInfo.nickName}鐨勫ソ鍙媊)
    } else if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '17') {
      console.log(`鎺ユ敹閭€璇锋垚涓哄ソ鍙嬬粨鏋滃け璐�,瀵规柟宸叉槸鎮ㄧ殑濂藉弸`)
    }
  }
  // console.log(`寮€濮嬫帴鍙�6fbd26cc27ac44d6a7fed34092453f77鐨勯個璇穃n`)
  // await inviteFriend('6fbd26cc27ac44d6a7fed34092453f77');
  // console.log(`鎺ユ敹閭€璇锋垚涓哄ソ鍙嬬粨鏋�:${JSON.stringify($.inviteFriendRes.helpResult)}`)
  // if ($.inviteFriendRes.helpResult.code === '0') {
  //   console.log(`鎮ㄥ凡鎴愪负${$.inviteFriendRes.helpResult.masterUserInfo.nickName}鐨勫ソ鍙媊)
  // } else if ($.inviteFriendRes.helpResult.code === '17') {
  //   console.log(`瀵规柟宸叉槸鎮ㄧ殑濂藉弸`)
  // }
}
async function duck() {
  for (let i = 0; i < 10; i++) {
    //杩欓噷寰幆鍗佹
    await getFullCollectionReward();
    if ($.duckRes.code === '0') {
      if (!$.duckRes.hasLimit) {
        console.log(`灏忛腑瀛愭父鎴�:${$.duckRes.title}`);
        // if ($.duckRes.type !== 3) {
        //   console.log(`${$.duckRes.title}`);
        //   if ($.duckRes.type === 1) {
        //     message += `銆愬皬楦瓙銆戜负浣犲甫鍥炰簡姘存淮\n`;
        //   } else if ($.duckRes.type === 2) {
        //     message += `銆愬皬楦瓙銆戜负浣犲甫鍥炲揩閫熸祰姘村崱\n`
        //   }
        // }
      } else {
        console.log(`${$.duckRes.title}`)
        break;
      }
    } else if ($.duckRes.code === '10') {
      console.log(`灏忛腑瀛愭父鎴忚揪鍒颁笂闄恅)
      break;
    }
  }
}
// ========================API璋冪敤鎺ュ彛========================
//楦瓙锛岀偣鎴戞湁鎯婂枩
async function getFullCollectionReward() {
  return new Promise(resolve => {
    const body = {"type": 2, "version": 6, "channel": 2};
    $.post(taskUrl("getFullCollectionReward", body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n涓滀笢鍐滃満: API鏌ヨ璇锋眰澶辫触 鈥硷笍鈥硷笍');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.duckRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

/**
 * 棰嗗彇10娆℃祰姘村鍔盇PI
 */
async function totalWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.totalWaterReward = await request(functionId);
}
//棰嗗彇棣栨娴囨按濂栧姳API
async function firstWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.firstWaterReward = await request(functionId);
}
//棰嗗彇缁�3涓ソ鍙嬫祰姘村悗鐨勫鍔辨按婊碅PI
async function waterFriendGotAwardForFarm() {
  const functionId = arguments.callee.name.toString();
  $.waterFriendGotAwardRes = await request(functionId, {"version": 4, "channel": 1});
}
// 鏌ヨ鑳屽寘閬撳叿鍗PI
async function myCardInfoForFarm() {
  const functionId = arguments.callee.name.toString();
  $.myCardInfoRes = await request(functionId, {"version": 5, "channel": 1});
}
//浣跨敤閬撳叿鍗PI
async function userMyCardForFarm(cardType) {
  const functionId = arguments.callee.name.toString();
  $.userMyCardRes = await request(functionId, {"cardType": cardType});
}
/**
 * 棰嗗彇娴囨按杩囩▼涓殑闃舵鎬у鍔�
 * @param type
 * @returns {Promise<void>}
 */
async function gotStageAwardForFarm(type) {
  $.gotStageAwardForFarmRes = await request(arguments.callee.name.toString(), {'type': type});
}
//娴囨按API
async function waterGoodForFarm() {
  await $.wait(1000);
  console.log('绛夊緟浜�1绉�');

  const functionId = arguments.callee.name.toString();
  $.waterResult = await request(functionId);
}
// 鍒濆鍖栭泦鍗℃娊濂栨椿鍔ㄦ暟鎹瓵PI
async function initForTurntableFarm() {
  $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}
async function lotteryForTurntableFarm() {
  await $.wait(2000);
  console.log('绛夊緟浜�2绉�');
  $.lotteryRes = await request(arguments.callee.name.toString(), {type: 1, version: 4, channel: 1});
}

async function timingAwardForTurntableFarm() {
  $.timingAwardRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}

async function browserForTurntableFarm(type, adId) {
  if (type === 1) {
    console.log('娴忚鐖嗗搧浼氬満');
  }
  if (type === 2) {
    console.log('澶╁ぉ鎶藉娴忚浠诲姟棰嗗彇姘存淮');
  }
  const body = {"type": type,"adId": adId,"version":4,"channel":1};
  $.browserForTurntableFarmRes = await request(arguments.callee.name.toString(), body);
  // 娴忚鐖嗗搧浼氬満8绉�
}
//澶╁ぉ鎶藉娴忚浠诲姟棰嗗彇姘存淮API
async function browserForTurntableFarm2(type) {
  const body = {"type":2,"adId": type,"version":4,"channel":1};
  $.browserForTurntableFarm2Res = await request('browserForTurntableFarm', body);
}
/**
 * 澶╁ぉ鎶藉鎷垮ソ绀�-鍔╁姏API(姣忎汉姣忓ぉ涓夋鍔╁姏鏈轰細)
 */
async function lotteryMasterHelp() {
  $.lotteryMasterHelpRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-3',
    babelChannel: "3",
    version: 4,
    channel: 1
  });
}

//棰嗗彇5浜哄姪鍔涘悗鐨勯澶栧鍔盇PI
async function masterGotFinishedTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterGotFinished = await request(functionId);
}
//鍔╁姏濂藉弸淇℃伅API
async function masterHelpTaskInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterHelpResult = await request(functionId);
}
//鎺ュ彈瀵规柟閭€璇�,鎴愪负瀵规柟濂藉弸鐨凙PI
async function inviteFriend() {
  $.inviteFriendRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-inviteFriend',
    version: 4,
    channel: 2
  });
}
// 鍔╁姏濂藉弸API
async function masterHelp() {
  $.helpResult = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0],
    babelChannel: "3",
    version: 2,
    channel: 1
  });
}
/**
 * 姘存淮闆ˋPI
 */
async function waterRainForFarm() {
  const functionId = arguments.callee.name.toString();
  const body = {"type": 1, "hongBaoTimes": 100, "version": 3};
  $.waterRain = await request(functionId, body);
}
/**
 * 鎵撳崱棰嗘按API
 */
async function clockInInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInInit = await request(functionId);
}

// 杩炵画绛惧埌API
async function clockInForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInForFarmRes = await request(functionId, {"type": 1});
}

//鍏虫敞锛岄鍒哥瓑API
async function clockInFollowForFarm(id, type, step) {
  const functionId = arguments.callee.name.toString();
  let body = {
    id,
    type,
    step
  }
  if (type === 'theme') {
    if (step === '1') {
      $.themeStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.themeStep2 = await request(functionId, body);
    }
  } else if (type === 'venderCoupon') {
    if (step === '1') {
      $.venderCouponStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.venderCouponStep2 = await request(functionId, body);
    }
  }
}

// 棰嗗彇杩炵画绛惧埌7澶╃殑鎯婂枩绀煎寘API
async function gotClockInGift() {
  $.gotClockInGiftRes = await request('clockInForFarm', {"type": 2})
}

//瀹氭椂棰嗘按API
async function gotThreeMealForFarm() {
  const functionId = arguments.callee.name.toString();
  $.threeMeal = await request(functionId);
}
/**
 * 娴忚骞垮憡浠诲姟API
 * type涓�0鏃�, 瀹屾垚娴忚浠诲姟
 * type涓�1鏃�, 棰嗗彇娴忚浠诲姟濂栧姳
 */
async function browseAdTaskForFarm(advertId, type) {
  const functionId = arguments.callee.name.toString();
  if (type === 0) {
    $.browseResult = await request(functionId, {advertId, type});
  } else if (type === 1) {
    $.browseRwardResult = await request(functionId, {advertId, type});
  }
}
// 琚按婊寸牳涓瑼PI
async function gotWaterGoalTaskForFarm() {
  $.goalResult = await request(arguments.callee.name.toString(), {type: 3});
}
//绛惧埌API
async function signForFarm() {
  const functionId = arguments.callee.name.toString();
  $.signResult = await request(functionId);
}
/**
 * 鍒濆鍖栧啘鍦�, 鍙幏鍙栨灉鏍戝強鐢ㄦ埛淇℃伅API
 */
async function initForFarm() {
  return new Promise(resolve => {
    const option =  {
      url: `${JD_API_HOST}?functionId=initForFarm`,
      body: `body=${escape(JSON.stringify({"version":4}))}&appid=wh5&clientVersion=9.1.0`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "cookie": cookie,
        "origin": "https://home.m.jd.com",
        "pragma": "no-cache",
        "referer": "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n涓滀笢鍐滃満: API鏌ヨ璇锋眰澶辫触 鈥硷笍鈥硷笍');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.farmInfo = JSON.parse(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 鍒濆鍖栦换鍔″垪琛ˋPI
async function taskInitForFarm() {
  console.log('\n鍒濆鍖栦换鍔″垪琛�')
  const functionId = arguments.callee.name.toString();
  $.farmTask = await request(functionId);
}
//鑾峰彇濂藉弸鍒楄〃API
async function friendListInitForFarm() {
  $.friendList = await request('friendListInitForFarm', {"version": 4, "channel": 1});
  // console.log('aa', aa);
}
// 棰嗗彇閭€璇峰ソ鍙嬬殑濂栧姳API
async function awardInviteFriendForFarm() {
  $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
}
//涓哄ソ鍙嬫祰姘碅PI
async function waterFriendForFarm(shareCode) {
  const body = {"shareCode": shareCode, "version": 6, "channel": 1}
  $.waterFriendForFarmRes = await request('waterFriendForFarm', body);
}
async function showMsg() {
  if ($.isNode() && process.env.FRUIT_NOTIFY_CONTROL) {
    $.ctrTemp = `${process.env.FRUIT_NOTIFY_CONTROL}` === 'false';
  } else if ($.getdata('jdFruitNotify')) {
    $.ctrTemp = $.getdata('jdFruitNotify') === 'false';
  } else {
    $.ctrTemp = `${jdNotify}` === 'false';
  }
  if ($.ctrTemp) {
    $.msg($.name, subTitle, message, option);
    if ($.isNode()) {
      allMessage += `${subTitle}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
      // await notify.sendNotify(`${$.name} - 璐﹀彿${$.index} - ${$.nickName}`, `${subTitle}\n${message}`);
    }
  } else {
    $.log(`\n${message}\n`);
  }
}

function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}
function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `http://share.turinglabs.net/api/v3/farm/query/${randomCount}/`, timeout: 10000,}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API璇锋眰澶辫触锛岃妫€鏌ョ綉璺噸璇昤)
        } else {
          if (data) {
            console.log(`闅忔満鍙栦釜${randomCount}鐮佹斁鍒版偍鍥哄畾鐨勪簰鍔╃爜鍚庨潰(涓嶅奖鍝嶅凡鏈夊浐瀹氫簰鍔�)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`绗�${$.index}涓含涓滆处鍙风殑鍔╁姏鐮�:::${$.shareCodesArr[$.index - 1]}`)
    newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`鐢变簬鎮ㄧ${$.index}涓含涓滆处鍙锋湭鎻愪緵shareCode,灏嗛噰绾虫湰鑴氭湰鑷甫鐨勫姪鍔涚爜\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      // newShareCodes = newShareCodes.concat(readShareCodeRes.data || []);
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`绗�${$.index}涓含涓滆处鍙峰皢瑕佸姪鍔涚殑濂藉弸${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log('寮€濮嬭幏鍙栭厤缃枃浠禱n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js鐢ㄦ埛璇峰湪jdCookie.js澶勫～鍐欎含涓渃k;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdFruitShareCodes = $.isNode() ? require('./jdFruitShareCodes.js') : '';
    //IOS绛夌敤鎴风洿鎺ョ敤NobyDa鐨刯d cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`鍏�${cookiesArr.length}涓含涓滆处鍙穃n`)
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(jdFruitShareCodes).forEach((item) => {
        if (jdFruitShareCodes[item]) {
          $.shareCodesArr.push(jdFruitShareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_fruit_inviter')) $.shareCodesArr = $.getdata('jd_fruit_inviter').split('\n').filter(item => !!item);
      console.log(`\nBoxJs璁剧疆鐨�${$.name}濂藉弸閭€璇风爜:${$.getdata('jd_fruit_inviter') ? $.getdata('jd_fruit_inviter') : '鏆傛棤'}\n`);
    }
    // console.log(`$.shareCodesArr::${JSON.stringify($.shareCodesArr)}`)
    // console.log(`jdFruitShareArr璐﹀彿闀垮害::${$.shareCodesArr.length}`)
    console.log(`鎮ㄦ彁渚涗簡${$.shareCodesArr.length}涓处鍙风殑鍐滃満鍔╁姏鐮乗n`);
    resolve()
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie杩囨湡
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('浜笢鏈嶅姟鍣ㄨ繑鍥炵┖鏁版嵁');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
function request(function_id, body = {}, timeout = 1000){
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskUrl(function_id, body), (err, resp, data) => {
        try {
          if (err) {
            console.log('\n涓滀笢鍐滃満: API鏌ヨ璇锋眰澶辫触 鈥硷笍鈥硷笍')
            console.log(JSON.stringify(err));
            console.log(`function_id:${function_id}`)
            $.logErr(err);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`浜笢鏈嶅姟鍣ㄨ闂暟鎹负绌猴紝璇锋鏌ヨ嚜韬澶囩綉缁滄儏鍐礰);
    return false;
  }
}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
    headers: {
      Cookie: cookie,
      UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    },
    timeout: 10000,
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '璇峰嬁闅忔剰鍦˙oxJs杈撳叆妗嗕慨鏀瑰唴瀹筡n寤鸿閫氳繃鑴氭湰鍘昏幏鍙朿ookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`馃敂${this.name}, 寮€濮�!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============馃摚绯荤粺閫氱煡馃摚=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`鉂楋笍${this.name}, 閿欒!`,t.stack):this.log("",`鉂楋笍${this.name}, 閿欒!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`馃敂${this.name}, 缁撴潫! 馃暃 ${s} 绉抈),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}