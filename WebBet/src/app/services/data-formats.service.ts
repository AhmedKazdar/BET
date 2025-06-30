import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { checkTodayTomorrow } from '../helpers/check-today-tomorrow';
import { environment } from 'src/environments/environment';
import { checkBettingEnable } from '../helpers/check-betting-enabled';

@Injectable({
  providedIn: 'root',
})
export class DataFormatsService {
  constructor() { }

  getSportDataFormat(sportsData: any) {
    let sportDataFormat: any = {};
    sportsData.forEach(function (item: any) {
      if (!sportDataFormat[item.eventTypeId]) {
        if (item.eventTypeId == 4) {
          item['sortId'] = 1;
        }
        if (item.eventTypeId == 1) {
          item['sortId'] = 2;
        }
        if (item.eventTypeId == 2) {
          item['sortId'] = 3;
        }
        sportDataFormat[item.eventTypeId] = {
          eventTypeId: item.eventTypeId,
          id: item.eventTypeId,
          sportsName: item.sportsName,
          sortId: item.sortId,
          tournaments: {},
        };
      }
      if (!sportDataFormat[item.eventTypeId].tournaments[item.competitionId]) {
        sportDataFormat[item.eventTypeId].tournaments[item.competitionId] = {
          competitionId: item.competitionId,
          id: item.competitionId,
          competitionName: item.competitionName,
          matches: {},
        };
      }

      if (
        !sportDataFormat[item.eventTypeId].tournaments[item.competitionId]
          .matches[item.eventId]
      ) {
        item['Fancymarket'] = [];
        item['BMmarket'] = [];
        item['todayTomorrow'] = checkTodayTomorrow(item);

        item['isBettable'] = false;
        item['isMarketData'] = false;
        item['isFancyData'] = false;
        item['isBookData'] = false;

        if (item.eventName.indexOf(' T10 v ') > -1) {
          item['isVir'] = true;
        }
        // if (item.premiumInplay == 1 && item.sportsName == 'cricket' && !item.isVir && item.competitionName != item.eventName.trim()) {
        //   item['isPremium'] = true;
        // } else {
        //   item['isPremium'] = false;
        // }
        item['isPremium'] = item.isPremium;
        // if (!item.isVir && item.eventTypeId<5 && item.competitionName != item.eventName.trim()) {
        //   item['isPremium'] = true;
        // } else {
        //   item['isPremium'] = false;
        // }
        if (item.eventName.indexOf(' SRL ') > -1) {
          // item['isPremium'] = true;
          item['isSrl'] = true;
        }
        item['videoEnabled'] = item.isStream;
        if (item.isInPlay == 1) {
          item['isBettable'] = true;

          // item['videoEnabled'] = true;
          item['inplay'] = true;
        }
        if (item.eventName.indexOf(' v ') == -1) {
          item['isWinner'] = true;
          // item['videoEnabled'] = false;
        }
        if (item.isVirtual) {
          item['isVir'] = true;
          // item['videoEnabled'] = false;
        }
        if (item.eventName.indexOf(' SRL ') > -1) {
          // item['videoEnabled'] = false;
        }

        if (item.eventName) {
          item['home'] = item.eventName.split(' v ')[0];
          item['away'] = item.eventName.split(' v ')[1];
        }
        let favArray = localStorage.getItem('favourite');

        if ((environment.siteName == 'cricbuzzer' || environment.siteName == 'cricbuzzerlive') && !item.isBettable) {
          item.isBettable = checkBettingEnable(item.time, item.minBeforeInplay)
        }

        sportDataFormat[item.eventTypeId].tournaments[
          item.competitionId
        ].matches[item.eventId] = item;
      }
    });

    if (!sportDataFormat[4]) {
      let data: any = {};
      data['eventTypeId'] = '4';
      data['sportsName'] = 'cricket';
      data['sortId'] = 1;
      data['tournaments'] = [];
      sportDataFormat['4'] = data;
    }
    if (!sportDataFormat[1]) {
      let data: any = {};
      data['eventTypeId'] = '1';
      data['sportsName'] = 'soccer';
      data['sortId'] = 2;
      data['tournaments'] = [];
      sportDataFormat['1'] = data;
    }
    if (!sportDataFormat[2]) {
      let data: any = {};
      data['eventTypeId'] = '2';
      data['sportsName'] = 'tennis';
      data['sortId'] = 3;
      data['tournaments'] = [];
      sportDataFormat['2'] = data;
    }

    if (!sportDataFormat[52]) {
      let data: any = {};
      data['eventTypeId'] = '52';
      data['sportsName'] = 'Kabaddi';
      data['sortId'] = 4;
      data['tournaments'] = [];
      sportDataFormat['52'] = data;
    }
    return sportDataFormat;
  }

  sportsWise(sportsData: any[]) {

    let SportsData: any = [];
    if (sportsData == undefined) {
      return SportsData;
    }
    _.forEach(sportsData, function (item: any, index: number) {
      let data: any = {};
      data["eventTypeId"] = item.eventTypeId;
      data["sportsName"] = item.sportsName;
      data["id"] = item.id;
      data['sortId'] = item.sortId;
      SportsData.push(data);
    })

    SportsData.sort(function (a: any, b: any) {
      return a.sortId - b.sortId;
    });


    return SportsData;
  }

  toursWise(toursData: any) {
    let ToursData: any[] = [];
   
    
    if (!toursData) {
      return ToursData;
    }
    if (!toursData.tournaments) {
      return ToursData;
    }
    _.forEach(toursData.tournaments, function (item: any, index: number) {
      let data: any = {};
      data["competitionId"] = item.competitionId;
      data["competitionName"] = item.competitionName;
      data["id"] = item.id;
      data["matches"] = [];

      _.forEach(item.matches, function (match: any) {
        data["matches"].push(match);
      });
      // console.log(item.matches);
      if (item.competitionName) {
        ToursData.push(data);
      }
    })

    return ToursData;
    
  }

  matchesWise(matchesData: any) {

    let MatchesData: any = [];
    if (!matchesData) {
      return MatchesData;
    }
    if (!matchesData.matches) {
      return MatchesData;
    }
    _.forEach(matchesData.matches, function (item: any, index: number) {
      let data: any = {};
      data["eventId"] = item.eventId;
      data["eventName"] = item.eventName;
      MatchesData.push(data);
    })

    return MatchesData;
  }

  sportEventWise(sportsData: any, isInplay: number) {
    // console.log(sportsData);

    let sportEventData: any[] = [];
    if (sportsData == undefined) {
      return sportEventData;
    }
    _.forEach(sportsData, function (item, index) {
      let data: any = {};
      let matchesData: any[] = [];
      let inplayCounts = 0;
      _.forEach(item.tournaments, function (item2) {
        _.forEach(item2.matches, function (item3) {

          if (item3.isInPlay == 1) {
            inplayCounts++;
          }

          if (isInplay == 1 && item3.isInPlay == 1) {
            matchesData.push(item3);
          }
          if (isInplay == 0) {
            matchesData.push(item3);
          }
        })
      })
      data["eventTypeId"] = item.eventTypeId;
      data["sportsName"] = item.sportsName;
      data["id"] = item.eventTypeId;
      data["sortId"] = item.sortId;
      data["inplayCounts"] = inplayCounts;

      data["matches"] = matchesData;
      if (matchesData.length > 0 && isInplay == 1) {
        sportEventData.push(data);
      } else {
        sportEventData.push(data);
      }
    })

    sportEventData.sort(function (a: any, b: any) {
      return a.sortId - b.sortId;
    });

    // //Remove after 6 extra sport
    // if (isInplay != 1) {
    //   sportEventData = sportEventData.filter((item, index) => {
    //     return index < 6;
    //   });
    // }
    // //Remove after 6 extra sport

    return sportEventData;
  }

  InplayTodayTomorrowEventWise(sportsData, tabType) {

    let sportEventData = [];
    if (sportsData == undefined) {
      return sportEventData;
    }
    _.forEach(sportsData, function (item) {
      let data = {};
      let matchesData = [];
      _.forEach(item.tournaments, function (item2) {
        _.forEach(item2.matches, function (item3) {
          if (item3.inplay && tabType == 'inplay') {  //inplay matches
            matchesData.push(item3);
          }
          if (!item3.inplay && tabType == 'today' && item3.todayTomorrow == 0) { //today matches
            matchesData.push(item3);
          }
          if (!item3.inplay && tabType == 'tomorrow' && item3.todayTomorrow == 1) { //tomorrow matches
            matchesData.push(item3);
          }
        })
      })
      data["eventTypeId"] = item.eventTypeId;
      data["sportsName"] = item.sportsName;
      data["id"] = item.eventTypeId;
      data["sortId"] = item.sortId;
      data["matches"] = matchesData;

      if (matchesData.length > 0) {
        sportEventData.push(data);
      }
    })

    sportEventData.sort(function (a, b) {
      return a.sortId - b.sortId;
    });

    // console.log(sportEventData)

    return sportEventData;
  }

  favouriteEventWise(sportsData, matchBfId?) {
    // console.log(sportsData,"df sport data")
    let groupedEvents = []
    let favArray = localStorage.getItem('favourite');
    let favArrays = [];
    if (favArray) {
      favArrays = favArray.split(',');
    }
    if (favArray || matchBfId) {
      // favArray = JSON.parse(favArray);
      _.forEach(sportsData, function (item, index) {
        _.forEach(item.tournaments, function (item2, index2) {
          _.forEach(item2.matches, function (item3, index3) {
            if (matchBfId) {
              if (matchBfId == item3.eventId) {
                groupedEvents.push(item3);
              }
            } else {
              item3['isMulti'] = false;

              let matchIndex = _.indexOf(favArrays, item3.eventId.toString());
              if (matchIndex > -1) {
                item3['isMulti'] = true;
                groupedEvents.push(item3);
              } else {
                _.forEach(item3.markets, function (item4, index4: number) {
                  let mktIndex = _.indexOf(favArrays, 'market_' + item3.eventId.toString() + '_' + item4.marketId);
                  if (mktIndex > -1) {
                    item3['isMulti'] = true;
                    item4['isMulti'] = true;
                  }
                });
                let bmIndex = _.indexOf(favArrays, 'bookmaker_' + item3.eventId.toString() + '_' + item3.marketId);
                if (bmIndex > -1) {
                  item3['isMulti'] = true;
                  item3['isBmMulti'] = true;
                }

                let fancyIndex = _.indexOf(favArrays, 'fancy_' + item3.eventId.toString() + '_' + item3.marketId);
                if (fancyIndex > -1) {
                  item3['isMulti'] = true;
                  item3['isFancyMulti'] = true;
                }

                _.forEach(favArrays, (fav) => {
                  let splitMarket = fav.split('_');
                  if (splitMarket[0] == 'premium' && item3.eventId == splitMarket[1]) {
                    item3['isMulti'] = true;
                    item3['isPreMulti'] = true;
                  }
                })
                if (item3.isMulti) {
                  groupedEvents.push(item3);
                }
              }
            }

          })
        })
      })
    }

    return groupedEvents;
  }
  ToggleFavourite(eventId) {
    // console.log(eventId,"toggle data format")
    let favArray = localStorage.getItem('favourite');

    eventId = eventId.toString();

    if (!favArray) {
      favArray = eventId;
    } else {
      if (!favArray.includes(eventId)) {
        favArray = favArray + ',' + eventId;
      } else {
        favArray = favArray.replace(',' + eventId, '');
        favArray = favArray.replace(eventId, '');

      }
    }
    // favArray = JSON.parse(favArray);

    // console.log(favArray);
    localStorage.setItem('favourite', favArray);

  }
  matchUnmatchBetsMarketWise(matchBets) {
    // console.log(matchBets)
    let matchWiseBets = [];
    let totalBets = 0;
    // matchBets = _.sortBy(matchBets, function(dateObj) {
    //   return new Date(dateObj.betTime);
    // });
    matchBets = _.orderBy(matchBets, [(obj) => new Date(obj.betTime)], ['desc']);

    _.forEach(matchBets, (bet, betIndex) => {

      bet['type'] = bet.betType;
      if (bet.betType == 'yes') {
        bet.betType = 'back';
      }
      if (bet.betType == 'no') {
        bet.betType = 'lay';
      }
      totalBets++;
      bet['stakeValid'] = true;
      bet['isActive'] = true;


      bet['profit'] = bet.PL;

      if (bet.isFancy == 1) {
        bet['odds'] = bet.runs + '/' + parseInt(bet.odds);
      }

      let eventIndex = _.findIndex(matchWiseBets, { 'eventId': bet.eventId });
      if (eventIndex < 0) {
        matchWiseBets.push({
          eventId: bet.eventId,
          eventName: bet.eventName,
          sportName: bet.sportName,
          markets: [{
            marketId: bet.eventId,
            bfId: bet.eventId,
            name: bet.marketName,
            marketType: bet.isFancy,
            eventName: bet.eventName,
            betType: [{
              betType: bet.betType,
              bets: [bet]
            }]
          }]
        });
      }
      else {
        let mktIndex = _.findIndex(matchWiseBets[eventIndex].markets, { 'name': bet.marketName });
        if (mktIndex < 0) {
          matchWiseBets[eventIndex].markets.push({
            marketId: bet.marketId,
            bfId: bet.bfId,
            name: bet.marketName,
            marketType: bet.isFancy,
            eventName: bet.eventName,
            betType: [{
              betType: bet.betType,
              bets: [bet]
            }]
          })
        }
        else {
          let typeIndex = _.findIndex(matchWiseBets[eventIndex].markets[mktIndex].betType, { 'betType': bet.betType });
          if (typeIndex < 0) {
            matchWiseBets[eventIndex].markets[mktIndex].betType.push({
              betType: bet.betType,
              bets: [bet]
            })
          }
          else {
            let betIndex = _.findIndex(matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].bets, { 'id': bet.id });
            if (betIndex < 0) {
              matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].bets.push(bet);
            }
          }
        }
      }
    });

    let matchWiseData = {
      matchWiseBets: matchWiseBets,
      totalBets: totalBets
    }

    return matchWiseData;

  }

  getRacingFormat(raceList) {
    // console.log(raceList)
    if (!raceList) {
      return;
    }
    let listRaceFormat = [];
    raceList.forEach(function (item, index) {
      let countryIndex = listRaceFormat.findIndex(race => race.countryCode == item.countryCode);
      // console.log(countryIndex)

      let listRacesFormat = [];

      let objectArray = Object.entries(item.races);

      objectArray.forEach(function (item2: any, index2) {

        // match.markets.push(market);
        let md = new Date(item2[1].startTime);
        let mn = md.getHours();
        let mday = md.getDay();

        let d = new Date();
        let n = d.getHours() - 1;
        let day = d.getDay();

        // console.log(day, mday)

        if (item2[1].inplay == 1) {
          listRacesFormat.splice(0, 1);
          item2[1]['isInplay'] = true;
          if (mn > n) {
            listRacesFormat.push(item2[1]);
          }
        } else {
          item2[1]['isInplay'] = false;
          if ((mn > n && mday == day) || mday > day) {
            listRacesFormat.push(item2[1]);
          }
        }

        if (listRacesFormat.length == 1) {
          if (listRacesFormat[0].inplay == 1) {
            listRacesFormat.splice(0, 1);

          }
        }
      })

      item.races = listRacesFormat;

      if (item.races.length > 0) {
        if (countryIndex == -1) {
          listRaceFormat.push({
            countryCode: item.countryCode,
            venueVo: [item]
          });
        } else {
          listRaceFormat[countryIndex].venueVo.push(item);
        }
      }
    });

    return listRaceFormat;
  }
  getNextRacingFormat(raceList) {
    // console.log(raceList)
    if (!raceList) {
      return;
    }
    let nextRacesFormat = [];
    raceList.forEach(function (item) {

      let objectArray = Object.entries(item.races);
      objectArray.forEach(function (item2: any) {
        item2[1]['venue'] = item.venue;
        item2[1]['name'] = item2[1].eventName.replace(/ /g, '');
        item2[1]['marketName'] = item2[1].marketName.split(' - ')[1];

        if (item2[1].inplay != 1) {
          nextRacesFormat.push(item2[1]);
        }
      })
    });

    nextRacesFormat = _.sortBy(nextRacesFormat, (a: any, b: any) => {
      return new Date(a.startTime);
    });

    return nextRacesFormat;
  }


  saveOneClickSetting(data) {
    localStorage.setItem('setPlayerOneClickBet', JSON.stringify(data));
  }

  getOneClickSetting() {
    return localStorage.getItem('setPlayerOneClickBet');
  }
}
