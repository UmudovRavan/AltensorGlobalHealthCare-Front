import { INTRO_FEATURES } from '../../data/homeData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  ChatIcon,
  CustomIcon,
  DestinationIcon,
  FreeMedicalIcon,
  ProtectIcon,
  RegisterIcon,
} from '../common/ZagrebIcons'

const ICON_MAP = {
  destination: DestinationIcon,
  freemedical: FreeMedicalIcon,
  protect: ProtectIcon,
  custom: CustomIcon,
  chat: ChatIcon,
  register: RegisterIcon,
}

export default function IntroSection() {
  const { t } = useTranslation()

  return (
    <section className="mt-[80px] md:mt-[100px]">
      <div className="zm-container">
        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[40px]">
          {INTRO_FEATURES.map((item) => {
            const Icon = ICON_MAP[item.icon]
            return (
              <div
                key={item.icon}
                className="flex min-h-[200px] flex-col justify-between rounded-[8px] border border-[#f4f4f4] bg-white p-[35px] transition-shadow hover:shadow-[0_12px_30px_rgba(12,58,148,0.06)]"
              >
                <div className="text-[#7fbb58]">
                  <Icon className="h-[60px] w-[60px]" />
                </div>
                <p className="mt-6 text-[2rem] font-semibold leading-[1.35] text-[#0c3a94]">
                  {t(`home.intro_${item.icon}`, item.text)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

