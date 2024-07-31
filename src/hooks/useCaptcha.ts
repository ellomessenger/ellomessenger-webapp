import type HCaptcha from '@hcaptcha/react-hcaptcha';

export default function useCaptcha() {
  const onLoad = async (error: (value: string) => void, token: HCaptcha | string | null) => {
    if (!token) {
      error('You must verify the captcha');
      return;
    }

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        secret: '0xD826eC8709810e79f833474CEC0069C61062FDE6',
        response: token,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // captchaRef.current?.execute();
    // captchaRef.current?.resetCaptcha();

    const json = await response.json();
  };

  return onLoad;
}
