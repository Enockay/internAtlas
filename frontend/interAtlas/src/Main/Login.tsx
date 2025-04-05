import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Checkbox, Button, Alert, Spin, Typography } from "antd";
import internLogo from "../assets/internlogo.jpeg";

interface LoginForm {
  studentId: string;
  email: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const baseURL = "http://localhost:3000/auth";

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await axios.post(`${baseURL}/login`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("Login Successful:", response.data);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f2f5",
      padding: "20px"
    }}>
      <Card style={{ maxWidth: 400, width: "100%", borderRadius: 8 }} bordered={false}>
        {/* Header with Logo */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
          <img src={internLogo} alt="internAtlas Logo" style={{ height: 50, marginRight: 10 }} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            internAtlas
          </Typography.Title>
        </div>

        <div style={{ padding: "16px 0" }}>
          <Typography.Title level={5} style={{ textAlign: "center", marginBottom: 16 }}>
            Sign In
          </Typography.Title>

          {loginError && (
            <Alert message={loginError} type="error" showIcon style={{ marginBottom: 16 }} />
          )}

          <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Form.Item
              label="Student ID"
              validateStatus={errors.studentId ? "error" : ""}
              help={errors.studentId?.message}
              required
            >
              <Input
                {...register("studentId", { required: "Student ID is required" })}
                placeholder="Enter your student ID"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
              required
            >
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox {...register("rememberMe")}>Remember me</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={isLoading}>
                {isLoading ? <Spin /> : "Sign In"}
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div style={{ background: "#fafafa", textAlign: "center", padding: "12px 0" }}>
          <Typography.Text>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#1890ff", textDecoration: "none" }}>
              Sign Up
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
