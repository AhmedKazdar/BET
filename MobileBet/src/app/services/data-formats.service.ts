import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { checkBettingEnable } from '../helpers/check-betting-enabled';
import { checkTodayTomorrow } from '../helpers/check-today-tomorrow';

@Injectable({
  providedIn: 'root',
})
export class DataFormatsService {

  // private siteName = environment.siteName;


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
        // item['isBettable'] = true;


        if (item.eventName.indexOf(' T10 v ') > -1) {
          item['isVir'] = true;
        }
        item['isPremium'] = item.isPremium;
        // if (item.premiumInplay == 1 && item.sportsName == 'cricket' && !item.isVir && item.competitionName != item.eventName.trim()) {
        //   item['isPremium'] = true;
        // } else {
        //   item['isPremium'] = false;
        // }
        // if (!item.isVir && item.eventTypeId < 5 && item.competitionName != item.eventName.trim()) {
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
        } else {
          item['isBettable'] = false;
          // item['videoEnabled'] = false;
          item['inplay'] = false;
        }
        if (item.eventName.indexOf(' v ') == -1 || item.eventName.indexOf(' SRL ') > -1) {
          // item['videoEnabled'] = false;
        }
        if (item.isVirtual) {
          item['isVir'] = true;
          // item['videoEnabled'] = false;
        }

        if (item.eventName) {
          item['home'] = item.eventName.split(' v ')[0];
          item['away'] = item.eventName.split(' v ')[1];
        }

        let favArray = localStorage.getItem('favourite');

        let favArrays = [];
        if (favArray) {
          favArrays = favArray.split(',');
        }
        // console.log(favArrays)
        if (item.markets[0]) {
          _.forEach(item.markets, function (market) {
            let matchIndex = _.indexOf(favArrays, 'market_' + item.eventId.toString() + '_' + market.marketId);
            // console.log(matchIndex)
            if (matchIndex > -1) {
              market['isMulti'] = true;
              item['isMulti'] = true;
              // console.log(market)
            } else {
              market['isMulti'] = false;
            }
          })
          let bmIndex = _.indexOf(favArrays, 'bookmaker_' + item.eventId.toString() + '_' + item.marketId);
          // console.log(matchIndex)
          if (bmIndex > -1) {
            item['isBmMulti'] = true;
            // console.log(market)
          } else {
            item['isBmMulti'] = false;
          }
          let fancyIndex = _.indexOf(favArrays, 'fancy_' + item.eventId.toString() + '_' + item.marketId);
          // console.log(matchIndex)
          if (fancyIndex > -1) {
            item['isFancyMulti'] = true;
            // console.log(market)
          } else {
            item['isFancyMulti'] = false;
          }

          _.forEach(favArrays, (fav) => {
            let splitMarket = fav.split('_');
            if (splitMarket[0] == 'premium' && item.eventId == splitMarket[1]) {
              item['isMulti'] = true;
              item['isPreMulti'] = true;
            }
          })

        }

  

        if ((environment.siteName == 'cricbuzzer' || environment.siteName == 'cricbuzzerlive') && !item.isBettable) {
          item.isBettable = checkBettingEnable(item.time, item.minBeforeInplay)
        }

        sportDataFormat[item.eventTypeId].tournaments[
          item.competitionId
        ].matches[item.eventId] = item;

          const currentTime = new Date();
          const matchTime = new Date(item.time);
          const timeDifference = matchTime.getTime() - currentTime.getTime();
          const minutesRemaining = Math.floor(timeDifference / (1000 * 60));
  
          if (minutesRemaining > 0 && minutesRemaining <= 15) {
            item['startsIn'] = `Starting in ${minutesRemaining}'`;
          }
          else {
            item['startsIn'] = '';
          }
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

  sportEventWise(sportsData: any, isInplay: number) {

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
    // console.log(sportsData)
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

  matchUnmatchBetsMarketWise(matchBets) {
    // console.log(matchBets)
    let matchWiseBets = [];
    let totalBets = 0;
    let totalUBets = 0;


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

      if (bet.unmatched == 1) {
        totalUBets++;
      }
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
            isMatched: bet.unmatched == 0 ? true : false,
            isUnmatched: bet.unmatched == 1 ? true : false,
            betType: [{
              betType: bet.betType,
              isMatched: bet.unmatched == 0 ? true : false,
              isUnmatched: bet.unmatched == 1 ? true : false,
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
            isMatched: bet.unmatched == 0 ? true : false,
            isUnmatched: bet.unmatched == 1 ? true : false,
            betType: [{
              betType: bet.betType,
              isMatched: bet.unmatched == 0 ? true : false,
              isUnmatched: bet.unmatched == 1 ? true : false,
              bets: [bet]
            }]
          })
        }
        else {
          let typeIndex = _.findIndex(matchWiseBets[eventIndex].markets[mktIndex].betType, { 'betType': bet.betType });
          if (typeIndex < 0) {
            matchWiseBets[eventIndex].markets[mktIndex].betType.push({
              betType: bet.betType,
              isMatched: bet.unmatched == 0 ? true : false,
              isUnmatched: bet.unmatched == 1 ? true : false,
              bets: [bet]
            })
          }
          else {
            let betIndex = _.findIndex(matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].bets, { 'id': bet.id });
            if (betIndex < 0) {
              matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].bets.push(bet);
            }
          }
          if (bet.unmatched == 0 && mktIndex > -1) {
            matchWiseBets[eventIndex].markets[mktIndex].isMatched = true;
          }
          if (bet.unmatched == 1 && mktIndex > -1) {
            matchWiseBets[eventIndex].markets[mktIndex].isUnmatched = true;
          }
          if (bet.unmatched == 0 && typeIndex > -1 && mktIndex > -1) {
            matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].isMatched = true;
          }
          if (bet.unmatched == 1 && typeIndex > -1 && mktIndex > -1) {
            matchWiseBets[eventIndex].markets[mktIndex].betType[typeIndex].isUnmatched = true;
          }
        }

      }
    });

    var matchWiseData = {
      matchWiseBets: matchWiseBets,
      totalBets: totalBets,
      totalUBets: totalUBets
    }

    return matchWiseData;

  }

  getRacingFormat(raceList) {
    // console.log(raceList)
    if (!raceList) {
      return;
    }
    var listRaceFormat = [];
    raceList.forEach(function (item, index) {
      let countryIndex = listRaceFormat.findIndex(race => race.countryCode == item.countryCode);
      // console.log(countryIndex)

      var listRacesFormat = [];

      let objectArray = Object.entries(item.races);

      objectArray.forEach(function (item2: any, index2) {

        // match.markets.push(market);
        var md = new Date(item2[1].startTime);
        var mn = md.getHours();
        var mday = md.getDay();

        var d = new Date();
        var n = d.getHours() - 1;
        var day = d.getDay();

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
    var nextRacesFormat = [];
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

      if (item.competitionName) {
        ToursData.push(data);
      }
    })

    return ToursData;
  }

  ToggleFavourite(eventId) {
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
}
