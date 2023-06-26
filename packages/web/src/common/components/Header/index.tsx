import { FaSolidClipboardList } from 'solid-icons/fa'
import { FiLogIn, FiLogOut, FiUsers } from 'solid-icons/fi'

import { Component } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'
import { firebaseProvider } from '@common/providers/firebase'
import { loggedUser, setLoggedUser } from '@contexts/user/user.context'
import { A } from '@solidjs/router'

const Header: Component = () => {
    const handleSignOut = () => {
        setLoggedUser(null)
        firebaseProvider.getAuth().signOut()
    }

    return (
        <>
            <div class="h-[80px] bg-gray-800 flex items-center px-6 justify-between">
                <A href="/">
                    <LogoSvg height={50} />
                </A>
                <div class="flex gap-3">
                    {loggedUser() ? (
                        <>
                            <A href="/users" title="Usuários" class="bg-gray-900 p-3 rounded-full hover:bg-gray-700">
                                <FiUsers size={20} />
                            </A>
                            <A
                                href="/worksheet"
                                title="Planilhas"
                                class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                            >
                                <FaSolidClipboardList size={20} />
                            </A>
                            <button
                                onClick={handleSignOut}
                                title="Logout"
                                class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <A href="/login" title="Login" class="bg-gray-900 p-3 rounded-full hover:bg-gray-700">
                            <FiLogIn size={20} />
                        </A>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header
