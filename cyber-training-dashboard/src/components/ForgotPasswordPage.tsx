export default  function ForgetPasswordPage() {
  return (
    <div>
        <label className="block text-gray-400 text-sm mb-2">password :</label>
         <input type="password" className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Enter your password" />
         <label className="block text-gray-400 text-sm mb-2">Confirm Password :</label>
         <input type="password" className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Confirm your password" />
    </div>
  )
}