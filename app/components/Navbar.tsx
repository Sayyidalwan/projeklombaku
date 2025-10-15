export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-red-500 p-4 text-white">
      <h1 className="text-xl font-bold">My Website</h1>
      <ul className="flex gap-6">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  )
}
