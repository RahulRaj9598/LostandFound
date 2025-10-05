import { useAuth } from '../../stores/auth.js'
import SignupImage from '../../assets/Signup.jpg'
import { Link } from 'react-router-dom';
export default function CTA() {
  const { isAuthenticated } = useAuth();

  return (
    <section
      className="relative"
      style={{ backgroundImage: `url(${SignupImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col items-center text-center gap-4">
        <h3 className="text-2xl font-semibold">Ready to reconnect with your belongings?</h3>
        <p className="text-gray-600">Post a lost item or share a found one—it takes less than a minute.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {!isAuthenticated ? (
            <Link to='/auth/signup' className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Get Started</Link>
          ):(
            <Link to="/posts/new" className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Get Started</Link>
          )}
          <a href="#found" className="px-5 py-2.5 rounded-md border border-gray-300 hover:bg-gray-50">Learn more</a>
        </div>
      </div>
      </div>
    </section>
  )
}


