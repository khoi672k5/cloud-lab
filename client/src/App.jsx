import { useEffect, useState } from "react";

function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const API_URL =
        "https://fantastic-guacamole-7vvvwq69769hxwj9-5000.app.github.dev";

    // Lấy danh sách sinh viên
    const fetchStudents = () => {
        fetch(`${API_URL}/api/students`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách sinh viên");
                }

                return response.json();
            })
            .then((data) => {
                setStudents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi GET:", error);
                setError(error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Gửi dữ liệu đến API POST /api/students
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/api/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: studentId,
                    name: name,
                    email: email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể thêm sinh viên");
            }

            console.log("Sinh viên đã thêm:", data);

            setMessage("Thêm sinh viên thành công!");

            // Xóa dữ liệu trong form
            setStudentId("");
            setName("");
            setEmail("");

            // Cập nhật lại danh sách
            fetchStudents();

        } catch (error) {
            console.error("Lỗi POST:", error);
            setError(error.message);
        }
    };

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                fontFamily: "Arial, sans-serif",
                padding: "20px"
            }}
        >
            <h1>Quản lý sinh viên</h1>

            <h2>Thêm sinh viên</h2>

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "15px" }}>
                    <label>MSSV:</label>
                    <br />
                    <input
                        type="text"
                        value={studentId}
                        onChange={(event) =>
                            setStudentId(event.target.value)
                        }
                        placeholder="Nhập MSSV"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Họ tên:</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Nhập họ tên"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Nhập email"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}
                >
                    Thêm sinh viên
                </button>
            </form>

            {message && (
                <p style={{ color: "green" }}>
                    {message}
                </p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    Lỗi: {error}
                </p>
            )}

            <hr style={{ margin: "30px 0" }} />

            <h2>Danh sách sinh viên</h2>

            {loading && <p>Đang tải dữ liệu...</p>}

            {!loading && !error && students.length === 0 && (
                <p>Chưa có sinh viên nào.</p>
            )}

            {!loading && students.length > 0 && (
                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >
                    <thead>
                        <tr>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;