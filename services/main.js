const Discord = require("discord.js");
const https = require("https");
const bot = new Discord.Client();
//require("dotenv/config"); 

bot.login(process.env.TOKEN_BOT);

bot.on('ready', async () => {
    console.log("Ordis is ready.");
    bot.user.setActivity("'$help' to help you tenno :)");
    return;
});

bot.on('message', async message => {

    //check if is a bot
    if (message.author.bot) return;
    if (message.content.indexOf('$') !== 0) return;
    /*********************************************/
    const word = message.content.toLowerCase();
    if (word.substring(0, 1) == '$') {
        var args = word.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'help':
                message.channel.send("```diff\n+ Command:\n```" +
                    "```md\n# $cetus: Shows Cetus state.\n"
                    + "\n# $earth: Shows Earth state.\n" +
                    "\n# $events: Shows active events.\n" +
                    "\n# $nightwave: Shows nightwave missions.\n" +
                    "\n# $acolytes: Shows acolytes state.\n" +
                    "\n# $sortie: Shows sortie state.\n" +
                    "\n# $ostrons: Show Ostrons missions and their status.\n" +
                    "\n# $fortuna: Show Fortuna missions and their status.\n" +
                    "\n# $orbvallis: Shows the state in Orb Vallis.\n" +
                    "\n# $barotime: Shows the state of Baro.\n" +
                    "\n# $baroreward: Shows the rewards that have Baro.\n" +
                    "\n# $fomorianprogress: Shows the progress of Fomorian.\n" +
                    "\n# $razorbackprogress: Shows the progress of Razorback.\n" +
                    "\n# $fissures: Shows the fissures, the mission and the relic type.\n" +
                    "\n# $cleanordis: Clean the text channel."
                    + "```");
                break;
            case 'cetus':
                https.get('https://api.warframestat.us/pc/cetusCycle', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        if (JSON.parse(data).isDay) {
                            message.channel.send("```yaml\n" + JSON.parse(data).timeLeft + " left until night.\n"
                                + "```");
                        } else {
                            message.channel.send("```fix\n" + JSON.parse(data).timeLeft + " left until day.\n" +
                                "```");
                        }
                    })
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'earth':
                https.get('https://api.warframestat.us/pc/earthCycle', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        if (JSON.parse(data).isDay) {
                            message.channel.send("```yaml\n" + JSON.parse(data).timeLeft + " left until night.\n"
                                + "```");
                        } else {
                            message.channel.send("```fix\n" + JSON.parse(data).timeLeft + " left until day.\n" +
                                "```");
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'events':
                https.get('https://api.warframestat.us/pc/events', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });

                    res.on('end', async () => {
                        let i = 1;
                        let today = new Date();
                        for (let event of JSON.parse(data)) {
                            if (!event.active) {
                                message.channel.send("```diff\n- No event/s available, the next one will be within: " +
                                    event.startString + "\n```");
                                return;
                            }
                            let exp = new Date(event.expiry);
                            message.channel.send("```" + i + ": " + event.description + " in " + event.node + " " +
                                + Math.round((exp - today) / 86400000) + " days left. ```");
                            i++
                        }
                    })
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'nightwave':
                https.get('https://api.warframestat.us/pc/nightwave', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });

                    res.on('end', async () => {
                        if (!JSON.parse(data).active) {
                            message.channel.send("```diff\n- No nightwaves available, the next one will be within: " +
                                JSON.parse(data).startString + "\n```");
                            return;
                        }
                        let i = 1;
                        let today = new Date();
                        let challenges = "";
                        for (let event of JSON.parse(data).activeChallenges) {
                            let exp = new Date(event.expiry);
                            challenges += i + ": " + event.desc + " (" + event.reputation + " rep)." + 
                            "\nTime: " + Math.round((exp - today) / 3600000) + " hours left " + "\n\n"
                            i++
                        }
                        message.channel.send("```" + challenges + " ```");
                    })
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'acolytes':
                https.get('https://api.warframestat.us/pc/persistentEnemies', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });

                    res.on('end', async () => {
                        if (JSON.parse(data).length <= 0) {
                            message.channel.send("```No acolyte/s available.```");
                            return;
                        }
                        let i = 1;
                        let today = new Date();
                        for (let event of JSON.parse(data)) {
                            let exp = new Date(event.expiry);
                            message.channel.send("```" + i + ": " + event.agentType + " y quedan: "
                                + Math.round((exp - today) / 3600000) + " hours (" + event.reputation + ")." + " ```");
                            i++
                        }
                    })
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'sortie':
                https.get('https://api.warframestat.us/pc/sortie', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        let i = 1;
                        let mission = new String();
                        message.channel.send("```" + JSON.parse(data).boss + ": " + JSON.parse(data).faction
                            + "\nTime remaining: " + JSON.parse(data).eta + "```");
                        for (let event of JSON.parse(data).variants) {
                            mission += "Mision" + i + ": " + event.missionType + " modifier: "
                                + event.modifier + " place: " + event.node + "\n\n";
                            i++
                        }
                        message.channel.send("```" + mission + " ```");
                    })
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'ostrons':
                https.get('https://api.warframestat.us/pc/syndicateMissions', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        let i = 1;
                        let j = 0;
                        let rewardLength = 0;
                        let rewardPool = new String();
                        let mission = new String();
                        while (JSON.parse(data).length > j) {
                            if (JSON.parse(data)[j].syndicate === "Ostrons") {
                                for (let jobs of JSON.parse(data)[j].jobs) {
                                    while (rewardLength < jobs.rewardPool.length) {
                                        rewardPool += jobs.rewardPool[rewardLength] + ", ";
                                        rewardLength++;
                                    }
                                    mission += "Mision " + i + ": " + jobs.type +
                                        "\nTime remaining: " + JSON.parse(data)[j].eta +
                                        "\nRewards: " + rewardPool.substring(0, rewardPool.length - 2) + "\n\n";
                                    i++
                                    rewardPool = new String();
                                    rewardLength = 0;
                                }
                                message.channel.send("```" + mission + "```");
                                return;
                            } else {
                                j++;
                            }
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'fortuna':
                https.get('https://api.warframestat.us/pc/syndicateMissions', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        let i = 1;
                        let j = 0;
                        let rewardLength = 0;
                        let rewardPool = new String();
                        let mission = new String();
                        while (JSON.parse(data).length > j) {
                            if (JSON.parse(data)[j].syndicate === "Solaris United") {
                                for (let jobs of JSON.parse(data)[j].jobs) {
                                    while (rewardLength < jobs.rewardPool.length) {
                                        rewardPool += jobs.rewardPool[rewardLength] + ", ";
                                        rewardLength++;
                                    }
                                    mission += "Mision " + i + ": " + jobs.type +
                                        "\nTime remaining: " + JSON.parse(data)[j].eta +
                                        "\nRewards: " + rewardPool.substring(0, rewardPool.length - 2) + "\n\n";
                                    i++
                                    rewardPool = new String();
                                    rewardLength = 0;
                                }
                                message.channel.send("```" + mission + "```");
                                return;
                            } else {
                                j++;
                            }
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'orbvallis':
                https.get('https://api.warframestat.us/pc/vallisCycle', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        if (JSON.parse(data).isWarm) {
                            message.channel.send("```ini\n" + "[Queda: " + JSON.parse(data).timeLeft + " para el frio]\n" + "```");
                        } else {
                            message.channel.send("```diff\n" + "- Queda: " + JSON.parse(data).timeLeft + " para el calor.\n" + "```");
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'barotime':
                https.get('https://api.warframestat.us/pc/voidTrader', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        if (JSON.parse(data).active) {
                            message.channel.send("```" + "Queda: " + JSON.parse(data).endString + " para que llegue a " + JSON.parse(data).location + "```");
                        } else {
                            message.channel.send("```" + "Queda: " + JSON.parse(data).startString + " para que llegue a " + JSON.parse(data).location + "```");
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'baroreward':
                https.get('https://api.warframestat.us/pc/voidTrader', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        if (JSON.parse(data).active) {
                            let i = 0;
                            let rewardPool = new String();
                            while (JSON.parse(data).inventory.length > i) {
                                rewardPool += JSON.parse(data).inventory[i].item + "\t"
                                    + JSON.parse(data).inventory[i].ducats + " ducats\t" + JSON.parse(data).inventory[i].credits
                                    + " credits\n\n";
                                i++
                            }
                            message.channel.send("```" + rewardPool + "```");
                        } else {
                            message.channel.send("```" + "Queda: " + JSON.parse(data).startString + " para que llegue a " + JSON.parse(data).location + "```");
                        }
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'fomorianprogress':
                https.get('https://api.warframestat.us/pc/constructionProgress', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        message.channel.send("```Fomorian state: " + JSON.parse(data).fomorianProgress + "%```");
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'razorbackprogress':
                https.get('https://api.warframestat.us/pc/constructionProgress', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        message.channel.send("```Razorback state: " + JSON.parse(data).razorbackProgress + "%```");
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'fissures':
                https.get('https://api.warframestat.us/pc/fissures', async (res) => {
                    var data = new String();
                    console.log('statusCode:', res.statusCode);
                    res.on('data', async function (d) {
                        data += d;
                    });
                    res.on('end', async () => {
                        let mission = new String();
                        let i = 1;
                        for (let fissures of JSON.parse(data)) {
                            if (fissures.active) {
                                mission += i + ": " + fissures.node + "\nMission: " + fissures.missionType +
                                    "\nEnemy: " + fissures.enemy + "\nRelic: " + fissures.tier + "\n" + fissures.eta + " left.\n\n";
                            }
                        }
                        message.channel.send("```" + mission + "```");
                    });
                }).on('error', async (err) => {
                    console.log("Error: " + err.message);
                });
                break;
            case 'cleanordis':
                let fetched = await message.channel.fetchMessages({ limit: 90 });
                message.channel.bulkDelete(fetched);
                message.channel.send("Ordis has cleaned the messages :)");
                break;
        }
    }
});