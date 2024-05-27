 psql -h localhost -U postgres   
 \c abc_pharmacy_db;



 PS D:\zainab\systolic\backend> go mod init abc_pharmacy
go: D:\zainab\systolic\backend\go.mod already exists
PS D:\zainab\systolic\backend> go get github.com/gin-gonic/gin
PS D:\zainab\systolic\backend> go get gorm.io/gorm
PS D:\zainab\systolic\backend> go get gorm.io/driver/postgres
PS D:\zainab\systolic\backend> go get github.com/gin-contrib/cors
PS D:\zainab\systolic\backend> go run main.go                    
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.