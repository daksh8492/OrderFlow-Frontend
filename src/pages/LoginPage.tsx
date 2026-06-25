import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login } from "@/services/authService";
import { loginSuccess } from "@/store/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router";

function LoginPage() {

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const token = await login({code, password})
      dispatch(loginSuccess(token))
      navigate("/app/dashboard")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>LoginPage</div>
      <div>
        <input type="text" value={code} onChange={e => setCode(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="button" value="submit" onClick={handleLogin} />
      </div>
    </>
  );
}

export default LoginPage;
