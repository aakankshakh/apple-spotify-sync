
export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-row items-center justify-center p-24"
    >
      <div className="text-center">
        <h1 className='text-4xl'>Playlist Sync</h1> 
        <p>Share your favourite playlist with your friends and have it sync almost instantaneously!</p>
        <div>
          <button className='rounded-full bg-[#ffa033]'> Log in to Apple Music</button>
          <button className='rounded-full bg-[#ffa033]'> Log in to Spotify</button>
        </div>
      </div>
      
    </main>
  )
}
