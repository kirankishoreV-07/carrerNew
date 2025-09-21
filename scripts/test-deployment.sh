#!/bin/bash

# Test deployment functionality
# This script tests all the main features of the deployed application

echo "🧪 Testing CareerAI Advisor Deployment"
echo "======================================"

# Configuration
if [ -z "$1" ]; then
    echo "Usage: $0 <deployment-url>"
    echo "Example: $0 https://your-app.vercel.app"
    exit 1
fi

BASE_URL=$1
echo "Testing deployment at: $BASE_URL"

# Function to test API endpoint
test_endpoint() {
    local endpoint=$1
    local method=$2
    local data=$3
    local description=$4
    
    echo ""
    echo "Testing: $description"
    echo "Endpoint: $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "200" ]; then
        echo "✅ PASS - HTTP $response"
    else
        echo "❌ FAIL - HTTP $response"
        return 1
    fi
}

# Test health endpoint
test_endpoint "/api/health" "GET" "" "Health Check"

# Test skills radar endpoint
skills_data='{
    "currentSkills": ["JavaScript", "React", "Node.js"],
    "targetRole": "Full Stack Developer",
    "experience": "Mid-level",
    "industry": "Technology",
    "location": "India"
}'
test_endpoint "/api/skills-radar" "POST" "$skills_data" "Skills Radar API"

# Test career simulator endpoint
career_data='{
    "skills": ["JavaScript", "Python", "React"],
    "interests": ["Web Development", "Machine Learning"],
    "experience": "2-3 years",
    "education": "B.Tech Computer Science",
    "location": "Bangalore, India",
    "preferredIndustries": ["Technology", "FinTech"],
    "careerGoals": "Become a senior software engineer",
    "timeHorizon": "5-year"
}'
test_endpoint "/api/career-simulator" "POST" "$career_data" "Career Simulator API"

# Test resume score endpoint info
test_endpoint "/api/resume-score" "GET" "" "Resume Score API Info"

echo ""
echo "🌐 Frontend Tests"
echo "================"

# Test main pages
pages=(
    "/"
    "/auth"
    "/dashboard"
    "/resume-score"
    "/skills-radar"
    "/career-simulator"
)

for page in "${pages[@]}"; do
    echo "Testing page: $page"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    if [ "$response" = "200" ]; then
        echo "✅ PASS - $page"
    else
        echo "❌ FAIL - $page (HTTP $response)"
    fi
done

echo ""
echo "🔧 Environment Tests"
echo "==================="

# Test if required environment variables are working
echo "Testing environment configuration..."

# Check if Firebase is properly configured (via health endpoint response)
health_response=$(curl -s "$BASE_URL/api/health")
if echo "$health_response" | grep -q "healthy"; then
    echo "✅ PASS - Environment variables configured"
else
    echo "❌ FAIL - Environment configuration issues"
fi

echo ""
echo "📊 Performance Tests"
echo "==================="

# Test response times
echo "Testing response times..."

start_time=$(date +%s%N)
curl -s "$BASE_URL" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

echo "Homepage response time: ${response_time}ms"

if [ $response_time -lt 3000 ]; then
    echo "✅ PASS - Response time under 3 seconds"
else
    echo "⚠️  WARN - Response time over 3 seconds"
fi

echo ""
echo "🎯 Summary"
echo "=========="
echo "Deployment URL: $BASE_URL"
echo ""
echo "Next steps:"
echo "1. Test file upload functionality manually"
echo "2. Test user authentication flow"
echo "3. Verify Google Cloud services integration"
echo "4. Check Firebase Firestore data persistence"
echo "5. Monitor logs for any errors"
echo ""
echo "📋 Manual Testing Checklist:"
echo "□ Upload a resume PDF and verify processing"
echo "□ Create user account and login"
echo "□ Generate skills radar report"
echo "□ Run career path simulation"
echo "□ Check data persistence in Firebase"
echo "□ Verify Google Cloud integration"
echo ""
echo "🎉 Automated tests completed!"
