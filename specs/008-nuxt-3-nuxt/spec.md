# Feature Specification: 地図距離計算ツール (Map Distance Calculator)

**Feature Branch**: `008-nuxt-3-nuxt`
**Created**: 2025-09-30
**Status**: Draft
**Input**: User description: "以下の要件に合う新しいツールを作成してください。なお実装要件は例なのでもっと良い要件があれば変えてもらって構いません。あなたは熟練の Nuxt 3 フロントエンドエンジニアです。以下の要件で完成済みのコード一式のみを出力してください。説明文や前置きは不要です。

ゴール

Nuxt 3 アプリで地図を表示し、クリックで 2点(A,B) を指定。A–B 間の 大円距離（直線距離） と 初期方位 をパネルに表示する。

マーカーはドラッグ可能。3回目以降のクリックは「近い方のマーカー」をその位置に移動。

A–B を結ぶ直線ポリラインを表示。

「クリア」「現在地へ」ボタンあり。

初期中心は 東京駅 (35.681236, 139.767125)、ズーム 12。文言は日本語。

技術・実装要件

Nuxt 3（最新)、TypeScript、Vite。

Leaflet 1.9系 を使用。SSR回避のため クライアント専用プラグイン（plugins/leaflet.client.ts）で動的 import。

タイルは OpenStreetMap 標準（APIキー不要）。Attribution を表示。

nuxt.config.ts の css に leaflet/dist/leaflet.css を登録。

地図を描画する部分は <ClientOnly> で囲む。

計算は haversine（WGS84 平均半径 R = 6,371,008.8 m）。経度差 Δλ は -π..π に正規化（atan2(sin Δλ, cos Δλ)）。

表示桁：

km：10km 未満は小数第3位、それ以上は小数第2位

m：小数1位

mile：小数第3位

初期方位：0–360°、小数1位

Geolocation ボタンは取得成功時のみ中心移動（失敗は無視）。

コードは読みやすく関数分割：useGeodesy()（haversine/方位角）、useDistanceFormat()（表示用フォーマッタ）など。

スタイルは簡素なCSSでOK（サイドバー幅≈320px、右に地図の 2 カラム）。"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
ユーザーは地図上で2つの地点を選択し、それらの間の正確な直線距離（大円距離）と初期方位角を知りたい。地図はインタラクティブで、選択した地点は後から調整可能であり、視覚的に2点を結ぶ線が表示される。また、自分の現在位置を地図の中心に設定できる機能も必要とする。

### Acceptance Scenarios
1. **Given** 地図が初期状態（東京駅中心、ズームレベル12）で表示されている、**When** ユーザーが地図上の任意の地点をクリックする、**Then** その地点にマーカーAが配置される
2. **Given** マーカーAが既に配置されている、**When** ユーザーが別の地点をクリックする、**Then** その地点にマーカーBが配置され、2点間の直線が表示され、距離情報パネルに距離（km/m/mile）と初期方位角が表示される
3. **Given** マーカーA・Bが配置されている、**When** ユーザーがマーカーをドラッグして移動する、**Then** マーカー位置が更新され、直線と距離情報パネルがリアルタイムで再計算・更新される
4. **Given** マーカーA・Bが配置されている、**When** ユーザーが地図上の3回目の地点をクリックする、**Then** クリック位置に最も近いマーカーがその新しい位置に移動し、直線と距離情報が更新される
5. **Given** マーカーA・Bが配置されている、**When** ユーザーが「クリア」ボタンをクリックする、**Then** すべてのマーカーと直線が削除され、距離情報パネルがクリアされる
6. **Given** 地図が表示されている、**When** ユーザーが「現在地へ」ボタンをクリックし、ブラウザが現在位置情報へのアクセスを許可する、**Then** 地図の中心が現在位置に移動する
7. **Given** ユーザーが「現在地へ」ボタンをクリックした、**When** ブラウザが現在位置情報の取得に失敗する、**Then** 地図は移動せず、エラーは無視される（ユーザーには特に通知しない）

### Edge Cases
- 2つのマーカーが非常に近接している場合でも、距離と方位角は正確に計算され表示される
- 経度が日付変更線（±180度）をまたぐ場合でも、経度差の正規化により正しい大円距離が計算される
- 南極点・北極点付近のマーカーでも、haversine計算により正確な距離が得られる
- ブラウザが位置情報サービスに対応していない場合、「現在地へ」ボタンの動作は失敗しても地図の表示に影響を与えない

## Requirements *(mandatory)*

### Functional Requirements

#### 地図表示
- **FR-001**: システムは初期表示時に東京駅（緯度35.681236、経度139.767125）を中心としてズームレベル12の地図を表示しなければならない
- **FR-002**: システムは地図タイルにOpenStreetMapを使用し、適切なアトリビューション（著作権表記）を表示しなければならない
- **FR-003**: システムは地図の拡大・縮小、パン（移動）操作を提供しなければならない

#### マーカー配置と操作
- **FR-004**: ユーザーは地図上の任意の地点をクリックしてマーカーを配置できなければならない
- **FR-005**: システムは最初のクリックでマーカーA、2回目のクリックでマーカーBを配置しなければならない
- **FR-006**: ユーザーは配置済みのマーカーをドラッグして位置を変更できなければならない
- **FR-007**: システムは3回目以降のクリックが発生した場合、クリック位置に最も近いマーカー（AまたはB）をその新しい位置に移動しなければならない

#### 距離と方位の計算・表示
- **FR-008**: システムはマーカーA・Bが両方配置されている場合、大円距離（haversine公式、WGS84平均半径 6,371,008.8m使用）を計算しなければならない
- **FR-009**: システムは計算された距離をキロメートル（km）、メートル（m）、マイル（mile）の3つの単位で表示しなければならない
- **FR-010**: システムは距離表示を以下の精度で行わなければならない：
  - km: 10km未満の場合は小数第3位まで、10km以上の場合は小数第2位まで
  - m: 小数第1位まで
  - mile: 小数第3位まで
- **FR-011**: システムはマーカーAからマーカーBへの初期方位角を計算し、0～360度の範囲で小数第1位まで表示しなければならない
- **FR-012**: システムは経度差の正規化（-π～πへの正規化、atan2(sin Δλ, cos Δλ)使用）を行い、日付変更線をまたぐ場合でも正確に計算しなければならない

#### 視覚的表現
- **FR-013**: システムはマーカーA・Bが両方配置されている場合、2点を結ぶ直線（ポリライン）を地図上に表示しなければならない
- **FR-014**: システムはマーカーの位置が変更された場合、直線をリアルタイムで更新しなければならない

#### ユーザー操作
- **FR-015**: システムは「クリア」ボタンを提供し、クリックされた場合すべてのマーカー、直線、距離情報を削除しなければならない
- **FR-016**: システムは「現在地へ」ボタンを提供し、ブラウザの位置情報APIで現在位置を取得して地図の中心に移動しなければならない
- **FR-017**: システムは現在位置の取得に失敗した場合でも、エラーを無視し地図表示に影響を与えてはならない

#### 言語とUI
- **FR-018**: システムのすべてのUI要素（ボタン、ラベル、メッセージ）は日本語で表示されなければならない
- **FR-019**: システムは距離情報を表示するパネル（サイドバー、推奨幅約320px）を提供しなければならない
- **FR-020**: システムは地図とサイドバーを2カラムレイアウトで配置しなければならない

### Key Entities

- **Marker (マーカー)**: 地図上の特定の地点を表すオブジェクト。緯度・経度の座標を持ち、ドラッグ可能。マーカーA・Bの2つが存在する
- **Line (直線)**: マーカーA・Bを結ぶ視覚的な線。マーカーの座標変更に応じて自動更新される
- **Distance Info (距離情報)**: 2点間の大円距離と初期方位角を含む計算結果。複数の単位（km、m、mile）で表示される

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---