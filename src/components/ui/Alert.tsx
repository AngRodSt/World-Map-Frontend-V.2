import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Alert {
  alert: {
    error: true | false;
    msg: string | null;
  };
}

export default function Alert({ alert }: Alert) {
  useEffect(() => {
    const { error, msg } = alert;
    toast.dismiss();

    if (!error) {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }, [alert]);

  return (
    <>
      <div>
        <Toaster />
      </div>
    </>
  );
}
