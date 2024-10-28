import logo from '../assets/logo.svg'
import letsStart from '../assets/illustration.svg'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'

export function EmptyGoals() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-8">
            <img src={logo} alt="in.orbit" />
            <img src={letsStart} alt="illustration" />
            <p className='text-zinc-300 leading-relaxed max-w-80 text-center'>
                Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
            </p>

            <DialogTrigger asChild>
                <Button>
                    <Plus className='size-4' />
                    Cadastrar meta
                </Button>
            </DialogTrigger>
        </div>
    )
}