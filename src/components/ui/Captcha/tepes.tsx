import type HCaptcha from '@hcaptcha/react-hcaptcha';

export interface IProps {
  onLoad: () => void;
  setToken: (value: HCaptcha | string | null) => void;
  captchaRef: any;
  token: HCaptcha | string | null;
}
