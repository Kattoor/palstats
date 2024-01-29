import {useState} from 'react'
import './App.css'

import guilds from '../../../sav-extractor/out/combined.json';

const players = guilds.reduce((acc, curr) => {
    acc.push(...curr.guildMembers);
    return acc;
}, []);
import {Card} from "primereact/card";

function App() {
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    function getGuildAdminName(adminId) {
        return players.find(({player}) => player.data.id === adminId);
    }

    return (
        <>
            {!selectedGuild ? <div className="flex gap-4">
                {
                    guilds.map((guild) =>
                        <Card className="cursor-pointer" onClick={() => setSelectedGuild(guild)} key={guild.guildId}
                              title={guild.guildName}>
                            <p>Admin: {getGuildAdminName(guild.guildAdminId).player.data.name}</p>
                            <p><b>{guild.guildMembers.length}</b> member(s)</p>
                        </Card>)
                }
            </div> : null}

            {!selectedPlayer && selectedGuild ?
                <>
                    <div className="pb-16 text-4xl">Guild: {selectedGuild.guildName}</div>
                    <div className="flex gap-4">
                        {
                            selectedGuild.guildMembers.map(({player}) =>
                                <Card className="cursor-pointer" onClick={() => setSelectedPlayer(player)}
                                      key={player.data.id} title={player.data.name}>
                                    <p>Level <b>{player.data.level}</b> ({player.data.exp} exp)</p>
                                    <p><b>{player.pals.length}</b> pals</p>
                                </Card>)
                        }
                    </div>
                </> : null}

            {selectedPlayer ?
                <>
                    <div className="pb-2 text-4xl">Guild: {selectedGuild.guildName}</div>
                    <div
                        className="pb-16 text-4xl">Player: {selectedPlayer.data.name} ({selectedPlayer.pals.length} pals)
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {
                            selectedPlayer.pals.sort((p1, p2) => p1.exp - p2.exp).map((pal, i) =>
                                <Card className="px-4" key={i} title={pal.characterName || pal.characterId}>
                                    <img className="h-16 m-auto rounded-full"
                                         src={"https://github.com/Kattoor/palimages/blob/main/T_" + pal.characterId + "_icon_normal.png?raw=true"}/>
                                    <p className="pt-4">Level <b>{pal.level}</b> ({pal.exp} exp)</p>
                                    <p>{pal.gender}</p>

                                    <div className="p-2 mt-4 border">
                                        <p><b>Moves</b></p>
                                        <p>{pal.moves.equiped.map(({name}) => <p>{name}</p>)}</p>
                                    </div>

                                    <div className="p-2 mt-4 border">
                                        <p><b>Crafting</b></p>
                                        <div className="flex flex-wrap max-w-44 gap-2 justify-center">
                                            {
                                                pal.craftSpeeds.filter(({rank}) => rank !== 0).map(({type, rank}) =>
                                                    <div>{type} {rank}</div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="p-2 mt-4 border">
                                        <p><b>Talents</b></p>
                                        <div>
                                            <span className="mr-4">HP: {pal.talent.hp}</span>
                                            <span>Melee: {pal.talent.melee}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="mr-4">Shot: {pal.talent.shot}</span>
                                            <span>Defense: {pal.talent.defense}</span>
                                        </div>
                                    </div>
                                </Card>
                            )
                        }
                    </div>
                </>
                : null}
        </>
    )
}

export default App
