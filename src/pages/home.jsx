import React from 'react';

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
            ✨ Introducing Version 2.0
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Build your next big idea faster than ever
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            A beautifully designed, premium template built with React and Tailwind CSS. 
            Supercharge your workflow and launch your product today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button className="rounded-xl !bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Get Started Free
            </button>
            <button className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
              Live Demo <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20 bg-slate-100/50 rounded-3xl my-10">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to scale
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <span className="text-2xl">⚡</span> Lightning Fast
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Optimized production builds ensures your users get a blazing fast experience instantly.</p>
              </dd>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <span className="text-2xl">🔒 Secure by Default</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Enterprise-grade security protocols to keep your data safe and compliant with global standards.</p>
              </dd>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <span className="text-2xl">🎨 Easy Styling</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Built completely with Tailwind CSS utility classes. Customizing styles takes just seconds.</p>
              </dd>
            </div>

          </dl>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-slate-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Boost your productivity.
                <br />
                Start using our app today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Join thousands of developers and creators who are building the future with our tools.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors">
                  Get started
                </button>
                <button className="text-sm font-semibold leading-6 !bg-green-900 text-white hover:text-indigo-400 transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            
            {/* Visual placeholder for an app mockup */}
            <div className="relative mt-16 h-80 lg:mt-8 flex items-center justify-center w-full lg:w-1/2">
              <div className="w-[32rem] h-64 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl opacity-20 blur-xl absolute"></div>
              <div className="bg-slate-800 border border-slate-700 w-full max-w-sm h-48 rounded-xl shadow-2xl p-4 flex flex-col justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                </div>
                <div className="h-8 w-full bg-indigo-600 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}