import { Equalizer, type DynamicIslandApi, type IslandActivity } from '../components/dynamic-island'
import { AirDrop, AlbumArt, CallTimer, Countdown, IncomingCall, MusicPlayer, ShakingBell, TimerIcon } from './views'

export type DemoActivity = 'silent' | 'timer' | 'music' | 'call' | 'callActive' | 'airdrop'

export function createActivity(name: DemoActivity, island: DynamicIslandApi): IslandActivity {
  switch (name) {
    case 'silent':
      return {
        id: 'silent',
        size: { width: 196 },
        duration: 2000,
        leading: <ShakingBell />,
        trailing: <span className="pr-[6px] text-[15px] font-semibold text-[#ff453a]">Silent</span>,
      }
    case 'timer':
      return { id: 'timer', size: { width: 236 }, leading: <TimerIcon />, trailing: <Countdown from={300} /> }
    case 'music':
      return {
        id: 'music',
        leading: <AlbumArt size={23} radius={6} />,
        trailing: <Equalizer color="#ff7ab6" height={15} />,
        expanded: <MusicPlayer />,
      }
    case 'call':
      return {
        id: 'call',
        size: 'medium',
        content: (
          <IncomingCall
            onAccept={() => {
              island.dismiss('call')
              island.show(createActivity('callActive', island))
            }}
            onDecline={() => island.dismiss('call')}
          />
        ),
      }
    case 'callActive':
      return { id: 'callActive', leading: <CallTimer />, trailing: <Equalizer color="#30d158" bars={6} height={14} /> }
    case 'airdrop':
      return { id: 'airdrop', size: 'medium', content: <AirDrop onDone={() => island.dismiss('airdrop')} /> }
  }
}
