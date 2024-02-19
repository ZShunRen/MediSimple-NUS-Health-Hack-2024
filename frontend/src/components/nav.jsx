import React from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Outlet, Link } from "react-router-dom";
const navigation = [
  { name: 'Home', to: '/', current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow-md border-b border-gray-400">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-24 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black outline-black hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-left sm:items-stretch sm:justify-start p-12 sm:p-6">
                <div className="flex flex-shrink-0 items-left">
                  <img
                    className="h-20 w-auto"
                    src="/MediSimple.png"
                    alt="HealthHack 2024"
                  />
                </div>
                <div className="hidden md:flex sm:ml-8 flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex space-x-3 items-center">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current ? 'bg-white text-black hover:bg-green-700 hover:text-slate-100' : 'bg-white text-black hover:bg-green-700 hover:text-slate-100',
                          'rounded-md px-3 py-3 text-ml font-ml'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-3 right-0 flex items-center pr- sm:static sm:inset-auto sm:ml-6 sm:pr-8">
                <Link to="/upload">
                  <button
                    className="rounded-3xl h-12 w-40 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white p-1 focus:outline-none transition-colors duration-150 ease-in-out text-ml font-medium"
                    >Upload a file
                  </button>
                </Link>

                {/* Profile dropdown */}
              
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-3 px-3 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-slate-50 hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out' : 'bg-gray-900 text-slate-50 hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out',
                    'block rounded-md px-3 py-3 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
