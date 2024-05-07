import { Image, Modal } from "@mantine/core"
import Logo from '../../assets/svg/logo-white.svg'
import { useContext } from "react"
import { AppContext } from "../../utils/context"

export const Splash = () => {

    const { splashLoading } = useContext(AppContext)


    return <Modal.Root centered opened={splashLoading}>
        <Modal.Overlay style={{ background: 'black' }} />
        <Modal.Content style={{ background: 'black' }}>
            <Image className="blink" src={Logo} />
        </Modal.Content>
    </Modal.Root>
}